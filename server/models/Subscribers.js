import mongoose from "mongoose";

// this model will be used for user to make subscriptons so that when ever a new product is added the user should get notified to their subscribed mail
const subscribersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Subscriber = mongoose.models.subscriber || mongoose.model('subscriber', subscribersSchema);

export default Subscriber;