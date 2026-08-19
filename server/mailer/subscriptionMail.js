import { transporter } from "../configs/transporter.js";

export const sendSubscriptionMail = async ({ to, subject, text, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `"GreenCart" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log("Email sent:", info.messageId);

        return info;
    } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
    }
}

// Generates a beautiful welcome email HTML
export const generateWelcomeEmailHTML = (frontendUrl, email) => {
    const unsubscribeUrl = `${frontendUrl}/api/subscriber/unsubscribe?email=${encodeURIComponent(email)}`;
    return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="background-color: #16a34a; padding: 32px 24px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Welcome to GreenCart! 🥦</h1>
            <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Your journey to fresh & organic groceries begins here.</p>
        </div>
        <div style="padding: 32px 24px; color: #334155; line-height: 1.6; background-color: #ffffff;">
            <p style="font-size: 16px; margin-top: 0; font-weight: 600; color: #1e293b;">Hi there,</p>
            <p style="font-size: 15px; color: #475569;">Thank you for subscribing to our newsletter! We are thrilled to have you join the GreenCart family.</p>
            <p style="font-size: 15px; color: #475569;">From now on, you'll be the first to know about our fresh arrivals, exclusive discounts, and seasonal offers direct from local farms.</p>
            <div style="text-align: center; margin: 36px 0;">
                <a href="${frontendUrl}" style="background-color: #16a34a; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; transition: background-color 0.2s;">Shop Fresh Now</a>
            </div>
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 28px 0;" />
            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-bottom: 0; line-height: 1.5;">
                You are receiving this email because you subscribed to the GreenCart newsletter.
                <br />
                If you wish to unsubscribe, you can <a href="${unsubscribeUrl}" style="color: #16a34a; text-decoration: none; font-weight: 600;">click here to unsubscribe</a> at any time.
            </p>
        </div>
    </div>
    `;
};

// Generates a beautiful HTML notification for new product arrivals
export const generateNewProductEmailHTML = (backendUrl, frontendUrl, product, email) => {
    // Unsubscribe URL points to our backend unsubscribe handler
    const unsubscribeUrl = `${backendUrl}/api/subscriber/unsubscribe?email=${encodeURIComponent(email)}`;
    const productUrl = `${frontendUrl}/products/${product.category}/${product._id}`;
    const productImg = (product.image && product.image.length > 0) ? product.image[0] : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';
    const descText = Array.isArray(product.description) ? product.description.join(', ') : product.description;

    return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="background-color: #16a34a; padding: 24px; text-align: center; color: white;">
            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; background-color: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; display: inline-block; margin-bottom: 8px;">New Arrival ✨</span>
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Fresh on the Shelves!</h1>
        </div>
        <div style="padding: 32px 24px; color: #334155; line-height: 1.6; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 24px;">
                <img src="${productImg}" alt="${product.name}" style="max-width: 100%; max-height: 250px; border-radius: 8px; object-fit: cover; box-shadow: 0 2px 4px rgba(0,0,0,0.05);" />
            </div>
            
            <h2 style="font-size: 20px; color: #1e293b; margin: 0 0 4px 0; text-align: center; font-weight: 700;">${product.name}</h2>
            <p style="font-size: 14px; color: #64748b; text-align: center; margin: 0 0 20px 0; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">
                Category: <span style="color: #16a34a;">${product.category}</span>
            </p>
            
            <div style="background-color: #f8fafc; padding: 18px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
                <span style="font-size: 14px; color: #94a3b8; text-decoration: line-through; margin-right: 8px;">$${product.price}</span>
                <span style="font-size: 24px; color: #16a34a; font-weight: 700;">$${product.offerPrice}</span>
            </div>
            
            <div style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 28px; background-color: #f8fafc; padding: 16px; border-radius: 8px;">
                <strong style="color: #1e293b; display: block; margin-bottom: 6px;">Product Details:</strong>
                <p style="margin: 0; color: #64748b;">${descText}</p>
            </div>
            
            <div style="text-align: center; margin: 32px 0;">
                <a href="${productUrl}" style="background-color: #16a34a; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; transition: background-color 0.2s;">View & Order Now</a>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 28px 0;" />
            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-bottom: 0; line-height: 1.5;">
                You are receiving this email because you subscribed to the GreenCart newsletter.
                <br />
                If you wish to unsubscribe, you can <a href="${unsubscribeUrl}" style="color: #16a34a; text-decoration: none; font-weight: 600;">click here to unsubscribe</a>.
            </p>
        </div>
    </div>
    `;
};