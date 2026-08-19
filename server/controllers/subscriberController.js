import Subscriber from "../models/Subscribers.js";
import { sendSubscriptionMail, generateWelcomeEmailHTML } from "../mailer/subscriptionMail.js";

// Handle user newsletter subscription
export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        
        const trimmedEmail = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json({ success: false, message: "Please provide a valid email address" });
        }

        let subscriber = await Subscriber.findOne({ email: trimmedEmail });
        
        if (subscriber) {
            if (subscriber.active) {
                return res.json({ success: true, message: "You are already subscribed!" });
            } else {
                subscriber.active = true;
                await subscriber.save();
            }
        } else {
            subscriber = await Subscriber.create({ email: trimmedEmail });
        }

        // Send welcome email
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const welcomeHtml = generateWelcomeEmailHTML(frontendUrl, trimmedEmail);
        
        try {
            await sendSubscriptionMail({
                to: trimmedEmail,
                subject: "Welcome to GreenCart! 🥦",
                text: "Thank you for subscribing to our newsletter!",
                html: welcomeHtml
            });
        } catch (emailErr) {
            console.error("Welcome email failed to send, but user is subscribed:", emailErr);
        }

        res.json({ success: true, message: "Subscribed successfully! Check your inbox for confirmation." });
    } catch (error) {
        console.error("Subscription error:", error);
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

// Handle unsubscription request (one-click)
export const unsubscribe = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).send("Email is required to unsubscribe.");
        }

        const trimmedEmail = email.trim().toLowerCase();
        
        // Find and deactivate subscriber
        await Subscriber.findOneAndUpdate(
            { email: trimmedEmail },
            { active: false }
        );

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        // Render beautiful HTML page
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Unsubscribed Successfully</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    min-height: 100vh; 
                    background-color: #f8fafc; 
                    margin: 0; 
                    padding: 20px;
                    box-sizing: border-box;
                }
                .container { 
                    text-align: center; 
                    background: white; 
                    padding: 40px 30px; 
                    border-radius: 16px; 
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02); 
                    max-width: 450px; 
                    width: 100%; 
                    border-top: 6px solid #16a34a; 
                }
                .icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                }
                h1 { 
                    color: #1e293b; 
                    font-size: 24px; 
                    margin: 0 0 12px 0; 
                    font-weight: 700;
                }
                p { 
                    color: #64748b; 
                    font-size: 15px; 
                    line-height: 1.6; 
                    margin: 0 0 28px 0; 
                }
                .btn { 
                    display: inline-block; 
                    background-color: #16a34a; 
                    color: white; 
                    padding: 12px 28px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: 600; 
                    font-size: 15px;
                    transition: background-color 0.2s, transform 0.1s; 
                }
                .btn:hover { 
                    background-color: #15803d; 
                }
                .btn:active {
                    transform: scale(0.98);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="icon">✅</div>
                <h1>Unsubscribed Successfully</h1>
                <p>You have been unsubscribed from our newsletter. You will no longer receive emails when new products are added to the store.</p>
                <a href="${frontendUrl}" class="btn">Return to Store</a>
            </div>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);
    } catch (error) {
        console.error("Unsubscription error:", error);
        res.status(500).send("An error occurred during unsubscription. Please try again.");
    }
};
