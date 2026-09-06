//"cloudinary" is used to add images
//"cors" : is used for connecting to frontend
//"multer" : used for uploading files in Node.js applications
//"Stripe" : is used for handling online payments — it’s one of the most popular payment processing platforms for web and mobile apps.


import 'dotenv/config';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors'
import connectDb from './configs/db.js';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';
import subscriberRouter from './routes/subscriberRoute.js';
import client from './configs/redis.js';

const app = express();
const port = process.env.PORT || 4000;

await connectDb();
await connectCloudinary();
await client.connect(); // Connect to Redis server


//These are URL's that are allowed to access our backend.
const allowedOrigins = ['http://localhost:5173', 'https://grocery-store-khaki-nine.vercel.app', 'https://greencart.yogeshworks.in']

app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)


//Middlware  configuration
app.use(express.json()) //all requests comming this server will be parsed
app.use(cookieParser())
app.use(cors({ origin: allowedOrigins, credentials: true }))


app.get('/', (req, res) => {
    res.send("Api is working")
})

app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)
app.use('/api/subscriber', subscriberRouter)


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})