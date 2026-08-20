
import { v2 as cloudinary } from 'cloudinary';
import Product from "../models/product.js";
import { sendSubscriptionMail } from '../mailer/subscriptionMail.js';
import { generateNewProductEmailHTML } from '../mailer/templetes/subscriptionTemplet.js';
import Subscriber from '../models/Subscribers.js';


// Add Product : /api/product/add
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData)

        const images = req.files;

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path,
                    { resource_type: 'image' }
                );
                return result.secure_url;
            })
        )

        const product = await Product.create({ ...productData, image: imagesUrl })

        // Send newsletter notifications to all active subscribers
        try {
            const subscribers = await Subscriber.find({ active: true });
            if (subscribers.length > 0) {
                const backendUrl = req.protocol + '://' + req.get('host');
                const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

                for (const sub of subscribers) {
                    try {
                        const emailHtml = generateNewProductEmailHTML(backendUrl, frontendUrl, product, sub.email);
                        await sendSubscriptionMail({
                            to: sub.email,
                            subject: `New Arrival: ${product.name} is now available! ✨`,
                            text: `Fresh arrival on GreenCart: Check out ${product.name} at only $${product.offerPrice}!`,
                            html: emailHtml
                        });
                    } catch (mailErr) {
                        console.error(`Failed to send product notification to ${sub.email}:`, mailErr.message);
                    }
                }
            }
        } catch (subErr) {
            console.error("Error in product newsletter dispatch:", subErr.message);
        }

        res.json({ success: true, message: "Product Added" })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }


}

// Get Product : /api/product/list
export const productList = async (req, res) => {
    try {
        const products = await Product.find({ isDeleted: { $ne: true } });
        res.json({ success: true, products })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Get single product : /api/product/id
export const productById = async (req, res) => {
    try {
        const { id } = req.body
        const product = await Product.findOne({ _id: id, isDeleted: { $ne: true } })
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found or has been deleted" })
        }
        res.json({ success: true, product })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }

}

// Change  product inStock : /api/product/stock
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;
        await Product.findByIdAndUpdate(id, { inStock })

        res.json({ success: true, message: "Stock Updated" })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }

}

// Delete Product : /api/product/delete
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }
        const product = await Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, message: "Product Deleted" });
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}