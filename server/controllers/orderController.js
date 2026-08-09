import Product from "../models/product.js";
import Order from "../models/order.js";
import stripe from 'stripe';
import User from '../models/user.js'


// Place Order COD : /api/order/cod

export const placeOrderCOD = async (req, res) => {
    try {
        const { items, address } = req.body;
        const { id: userId } = req.user; // we are change => userId = req.body to userId = req.user
        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalod data" })
        }


        let amount = await items.reduce(async (accPromise, item) => {
            const acc = await accPromise; // Await the previous accumulator value
            const product = await Product.findById(item.product);
            return acc + product.offerPrice * item.quantity; // Correct calculation
        }, Promise.resolve(0)); // Initialize acc with a resolved promise

        // Add Tax charge (2%)
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });

        return res.json({ success: true, message: "Order Placed Succesfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

};

// Place Order Stripe : /api/order/stripe

export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        const { origin } = req.headers;  // this is nothing but frontend url
        // const { id: userId } = req.user; // we are change => userId = req.body to userId = req.user
        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalod data" })
        }
        let productData = []

        let amount = await items.reduce(async (accPromise, item) => {
            const acc = await accPromise; // Await the previous accumulator value
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,

            })
            return acc + product.offerPrice * item.quantity; // Correct calculation
        }, Promise.resolve(0)); // Initialize acc with a resolved promise

        // Add Tax charge (2%)
        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
        });

        //Stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        // create line items for stripe
        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: "INR",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100
                },
                quantity: item.quantity,
            }
        })

        // create session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        })
        return res.json({ success: true, url: session.url });
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

};

// Stripe WEBHOOK to verify payment (deepseek)
// export const stripeWebhooks = async (req, res) => {
//     const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

//     const sig = req.headers['stripe-signature'];
//     let event;

//     try {
//         // IMPORTANT: Use raw body, not parsed JSON
//         event = stripeInstance.webhooks.constructEvent(
//             req.rawBody || req.body, // Use raw body if available
//             sig,
//             process.env.STRIPE_WEBHOOK_SECRET
//         );
//     } catch (err) {
//         console.error(`Webhook signature verification failed.`, err.message);
//         return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     try {
//         // Handle the event
//         switch (event.type) {
//             case 'payment_intent.succeeded':
//                 const paymentIntent = event.data.object;
//                 console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);

//                 // Get the checkout session (if needed)
//                 if (paymentIntent.metadata.sessionId) {
//                     const session = await stripeInstance.checkout.sessions.retrieve(
//                         paymentIntent.metadata.sessionId
//                     );

//                     const { orderId, userId } = session.metadata;

//                     // Update order status
//                     await Order.findByIdAndUpdate(orderId, {
//                         isPaid: true,
//                         paidAt: new Date(),
//                         paymentResult: {
//                             id: paymentIntent.id,
//                             status: paymentIntent.status,
//                             update_time: new Date()
//                         }
//                     });

//                     // Clear user cart
//                     await User.findByIdAndUpdate(userId, { cartItems: [] });
//                 }
//                 break;

//             case 'payment_intent.payment_failed':
//                 const failedPayment = event.data.object;
//                 console.error(` Payment failed: ${failedPayment.last_payment_error?.message}`);

//                 if (failedPayment.metadata.orderId) {
//                     await Order.findByIdAndDelete(failedPayment.metadata.orderId);
//                 }
//                 break;

//             case 'checkout.session.completed':
//                 // Alternatively handle checkout.session.completed event
//                 const session = event.data.object;
//                 console.log(`Checkout session completed: ${session.id}`);
//                 break;

//             default:
//                 console.log(`Unhandled event type: ${event.type}`);
//         }

//         res.json({ received: true });
//     } catch (err) {
//         console.error('Error processing webhook:', err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// Stripe WEBHOOK to verify payments Action(status) : /stripe
export const stripeWebhooks = async (request, response) => {
    //Stripe Gateway Initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        response.status(400).send(`Webhook Error : ${error.message} `)
    }

    // Handle the event
    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting Session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const { orderId, userId } = session.data[0].metadata;

            // Mark Payment as Paid
            await Order.findByIdAndUpdate(orderId, { isPaid: true })

            // Clear user cart
            await User.findByIdAndUpdate(userId, { cartItems: {} });
            break;
        }

        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting Session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const { orderId } = session.data[0].metadata;
            await Order.findByIdAndDelete(orderId);
            break;
        }


        default:
            console.error(`Unhandled event type ${event.type}`)
            break;
    }
    response.json({ received: true })
}

// Get Order by User ID : /api/order/user  ( to get order details of individual user )

export const getUserOrders = async (req, res) => {
    try {
        // const { userId } = req.body;
        const { id: userId } = req.user; // we are changi => userId = req.body to userId = req.user

        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}


// Get all Orders detail's for seller or admin : /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
