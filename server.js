import app from "./app.js";
import { connectDB } from "./config/database.js";
import cloudinary from "cloudinary";
// import RazorPay from "razorpay";
import Stripe from "stripe";
// const Stripe = require('stripe');

connectDB();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

// export const instance = new RazorPay({
//     key_id: process.env.RAZORPAY_API_KEY,
//     key_secret: process.env.RAZORPAY_API_SECRET,
// });

export const stripe = new Stripe(process.env.STRIPE_API_SECRET);


app.listen(process.env.PORT, () => {
    console.log(`Server is working on port: ${process.env.PORT}`);
});
