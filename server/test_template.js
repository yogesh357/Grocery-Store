
import 'dotenv/config';
import { generateNewProductEmailHTML } from './mailer/templetes/subscriptionTemplet.js';
import { sendSubscriptionMail } from './mailer/subscriptionMail.js';

async function test() {
    const dummyProduct = {
        _id: '60c72b2f9b1d8e25a81c7e9a',
        name: 'Organic Sweet Strawberries',
        category: 'fruits',
        price: 5.99,
        offerPrice: 4.49,
        image: ['https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500'],
        description: ['Fresh, sweet organic strawberries sourced directly from local farms.']
    };

    console.log("Generating template...");
    const html = generateNewProductEmailHTML('http://localhost:4000', 'http://localhost:5173', dummyProduct, 'antigravity-test@yopmail.com');

    console.log("Checking if image is in HTML...");
    if (html.includes(dummyProduct.image[0])) {
        console.log("✅ Image is successfully embedded in the HTML!");
    } else {
        throw new Error("❌ Product image not found in HTML!");
    }

    console.log("Sending a test email to verify SMTP delivery...");
    const info = await sendSubscriptionMail({
        to: 'antigravity-test@yopmail.com',
        subject: `New Arrival: ${dummyProduct.name} is now available! ✨`,
        text: `Fresh arrival: ${dummyProduct.name}`,
        html: html
    });
    console.log("✅ Email sent successfully! Message ID:", info.messageId);
}

test().catch(err => {
    console.error("Test failed:", err);
    process.exit(1);
});
