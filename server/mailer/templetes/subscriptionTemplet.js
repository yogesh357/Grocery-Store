export const generateNewProductEmailHTML = (backendUrl, frontendUrl, product, email) => {
    const unsubscribeUrl = `${backendUrl}/api/subscriber/unsubscribe?email=${encodeURIComponent(email)}`;
    const productUrl = `${frontendUrl}/products/${product.category}/${product._id}`;

    // Select the first image from product.image array or fallback
    const productImg = (product.image && product.image.length > 0) ? product.image[0] : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';
    const descText = Array.isArray(product.description) ? product.description.join(', ') : product.description;

    return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #16a34a, #15803d); padding: 32px 24px; text-align: center; color: white;">
            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; background-color: rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 20px; display: inline-block; margin-bottom: 12px; backdrop-filter: blur(4px);">New Arrival ✨</span>
            <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Fresh on the Shelves!</h1>
            <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">We just added a delicious new item to our grocery collection.</p>
        </div>
        
        <!-- Content Body -->
        <div style="padding: 32px 24px; color: #334155; line-height: 1.6;">
            <!-- Product Image Section -->
            <div style="text-align: center; margin-bottom: 28px;">
                <img src="${productImg}" alt="${product.name}" width="300" style="display: block; width: 300px; max-width: 100%; height: auto; max-height: 300px; border-radius: 12px; object-fit: cover; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); border: 4px solid #f8fafc; margin: 0 auto;" />
            </div>
            
            <!-- Product Title and Category -->
            <h2 style="font-size: 22px; color: #1e293b; margin: 0 0 6px 0; text-align: center; font-weight: 700;">${product.name}</h2>
            <p style="font-size: 13px; color: #64748b; text-align: center; margin: 0 0 24px 0; text-transform: uppercase; font-weight: 600; letter-spacing: 0.75px;">
                Category: <span style="color: #16a34a; font-weight: 700;">${product.category}</span>
            </p>
            
            <!-- Price Card -->
            <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 28px;">
                <span style="font-size: 14px; color: #94a3b8; text-decoration: line-through; margin-right: 10px;">$${product.price}</span>
                <span style="font-size: 26px; color: #16a34a; font-weight: 800;">$${product.offerPrice}</span>
                <div style="font-size: 12px; color: #16a34a; font-weight: 600; margin-top: 4px;">Exclusive Newsletter Price!</div>
            </div>
            
            <!-- Product Description -->
            <div style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 32px; background-color: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #16a34a;">
                <strong style="color: #1e293b; display: block; margin-bottom: 6px; font-size: 15px;">Product Description:</strong>
                <p style="margin: 0; color: #475569;">${descText}</p>
            </div>
            
            <!-- Call to Action -->
            <div style="text-align: center; margin: 36px 0;">
                <a href="${productUrl}" style="background: linear-gradient(135deg, #16a34a, #15803d); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(22, 163, 74, 0.2); transition: background 0.2s;">Order Fresh Now</a>
            </div>
            
            <!-- Footer Divider -->
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 32px 0;" />
            
            <!-- Footer Links -->
            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-bottom: 0; line-height: 1.5;">
                You are receiving this email because you subscribed to the GreenCart newsletter.
                <br />
                If you wish to unsubscribe, you can <a href="${unsubscribeUrl}" style="color: #16a34a; text-decoration: none; font-weight: 600;">click here to unsubscribe</a>.
            </p>
        </div>
    </div>
    `;
};
