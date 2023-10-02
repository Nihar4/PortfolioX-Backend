import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Users } from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
// import { instance } from "../server.js";
import crypto from "crypto";
import { Payment } from "../models/payment.js";
import { stripe } from "../server.js";

// export const buySubscription = catchAsyncError(async (req, res, next) => {

//     const user = await Users.findById(req.user._id);
//     const { name, symbol, quantity, avgbuyingprice } = req.body;

//     // if (user.role === "admin")
//     //     return next(new ErrorHandler("Admin can't buy subscription", 400));

//     // const plan_id = process.env.PLAN_ID || "plan_MHIdm0GjPjJmVn";
//     // console.log(instance)
//     const subscription = await instance.orders.create({
//         amount: quantity * avgbuyingprice * 100,
//         currency: "INR",
//         // plan_id,
//         // customer_notify: 1,
//         // total_count: 12,
//     });
//     // console.log(subscription)
//     // user.portfolio.filter((item)=>{
//     //     item.subscription.status!="created"
//     // })
//     const newPortfolio = user.portfolio.filter((item) => {
//         if (item.subscription.status !== "created") return item;
//     });
//     user.portfolio = newPortfolio;
//     user.portfolio.push({
//         name: name,
//         symbol: symbol,
//         quantity: quantity,
//         avgbuyingprice: avgbuyingprice,
//         subscription: {
//             id: subscription.id,
//             status: subscription.status
//         }
//     })
//     // user.subscription.id = subscription.id;

//     // user.subscription.status = subscription.status;

//     await user.save();
//     const subscription_id = user.portfolio.find((user) => user.subscription.status === 'created');
//     // console.log(subscription_id.subscription.id)
//     res.status(201).json({
//         success: true,
//         subscriptionId: subscription.id,
//     });
// });

export const buySubscription1 = catchAsyncError(async (req, res, next) => {

    const user = await Users.findById(req.user._id);
    const { name, symbol, quantity, avgbuyingprice } = req.body;

    const { client_secret } = await stripe.paymentIntents.create({
        amount: Number(quantity * avgbuyingprice * 100),
        currency: "inr",
    });

    res.status(200).json({
        success: true,
        client_secret,
    });


    const newPortfolio = user.portfolio.filter((item) => {
        if (item.subscription.status !== "created") return item;
    });
    user.portfolio = newPortfolio;
    user.portfolio.push({
        name: name,
        symbol: symbol,
        quantity: quantity,
        avgbuyingprice: avgbuyingprice,
        subscription: {
            id: client_secret,
            status: "created"
        }
    })


    await user.save();
    const subscription_id = user.portfolio.find((user) => user.subscription.status === 'created');
    console.log(subscription_id.subscription.id);
});

// export const paymentVerification = catchAsyncError(async (req, res, next) => {
//     const { razorpay_signature, razorpay_payment_id, razorpay_subscription_id } =
//         req.body;

//     const user = await Users.findById(req.user._id);

//     // const subscription_id = user.subscription.id;
//     const stock = user.portfolio.find((user) => user.subscription.status === 'created');
//     const subscription_id = stock.subscription.id;
//     console.log(subscription_id)


//     // const generated_signature = crypto
//     //     .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
//     //     .update(razorpay_payment_id + "|" + subscription_id, "utf-8")
//     //     .digest("hex");

//     // const isAuthentic = generated_signature === razorpay_signature;
//     const isAuthentic = true;

//     if (!isAuthentic) {
//         // return res.redirect(`${process.env.FRONTEND_URL}/paymentfail`);
//     }

//     // database comes here
//     await Payment.create({
//         razorpay_signature,
//         razorpay_payment_id,
//         razorpay_subscription_id,
//     });

//     const newPortfolio = user.portfolio.filter((item) => {
//         if (item.subscription.status !== "created") return item;
//     });

//     const stock2 = newPortfolio.find((user) => user.name === stock.name);

//     if (stock2) {
//         const newPortfolio1 = newPortfolio.filter((item) => {
//             if (item.name !== stock2.name) return item;
//         });
//         newPortfolio1.push({
//             name: stock.name,
//             symbol: stock.symbol,
//             quantity: stock2.quantity + stock.quantity,
//             avgbuyingprice: ((stock.quantity * stock.avgbuyingprice) + (stock2.quantity * stock2.avgbuyingprice)) / (stock2.quantity + stock.quantity),
//             subscription: {
//                 id: stock.subscription.id,
//                 status: "active"
//             }
//         })
//         user.portfolio = newPortfolio1;
//     }
//     else {
//         newPortfolio.push({
//             name: stock.name,
//             symbol: stock.symbol,
//             quantity: stock.quantity,
//             avgbuyingprice: stock.avgbuyingprice,
//             subscription: {
//                 id: stock.subscription.id,
//                 status: "active"
//             }
//         })
//         user.portfolio = newPortfolio;
//     }

//     // user.subscription.status = "active";

//     await user.save();

//     // res.redirect(
//     //     `${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`
//     // );
//     res.status(200).json({
//         success: true,
//     });
// });

export const paymentVerification1 = catchAsyncError(async (req, res, next) => {
    const { paymentIntentId, subscriptionId } =
        req.body;

    const user = await Users.findById(req.user._id);

    // const subscription_id = user.subscription.id;
    const stock = user.portfolio.find((user) => user.subscription.status === 'created');
    const subscription_id = stock.subscription.id;
    console.log(subscription_id)


    // const generated_signature = crypto
    //     .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    //     .update(razorpay_payment_id + "|" + subscription_id, "utf-8")
    //     .digest("hex");

    // const isAuthentic = generated_signature === razorpay_signature;
    const isAuthentic = true;

    if (!isAuthentic) {
        // return res.redirect(`${process.env.FRONTEND_URL}/paymentfail`);
    }

    // database comes here
    await Payment.create({
        paymentIntentId,
        subscriptionId,

    });

    const newPortfolio = user.portfolio.filter((item) => {
        if (item.subscription.status !== "created") return item;
    });

    const stock2 = newPortfolio.find((user) => user.name === stock.name);

    if (stock2) {
        const newPortfolio1 = newPortfolio.filter((item) => {
            if (item.name !== stock2.name) return item;
        });
        newPortfolio1.push({
            name: stock.name,
            symbol: stock.symbol,
            quantity: stock2.quantity + stock.quantity,
            avgbuyingprice: ((stock.quantity * stock.avgbuyingprice) + (stock2.quantity * stock2.avgbuyingprice)) / (stock2.quantity + stock.quantity),
            subscription: {
                id: stock.subscription.id,
                status: "active"
            }
        })
        user.portfolio = newPortfolio1;
    }
    else {
        newPortfolio.push({
            name: stock.name,
            symbol: stock.symbol,
            quantity: stock.quantity,
            avgbuyingprice: stock.avgbuyingprice,
            subscription: {
                id: stock.subscription.id,
                status: "active"
            }
        })
        user.portfolio = newPortfolio;
    }

    // user.subscription.status = "active";

    await user.save();

    // res.redirect(
    //     `${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`
    // );
    res.status(200).json({
        success: true,
    });
});


export const getRazorPayKey = catchAsyncError(async (req, res, next) => {
    res.status(200).json({
        success: true,
        key: process.env.STRIPE_API_KEY,
    });
});

// export const cancelSubscription = catchAsyncError(async (req, res, next) => {
//     const user = await Users.findById(req.user._id);

//     const subscriptionId = user.subscription.id;
//     console.log(subscriptionId)
//     let refund = false;

//     // try {
//     await instance.subscriptions.cancel(subscriptionId);
//     // } catch (error) {
//     // console.log(error);
//     // }


//     const payment = await Payment.findOne({
//         razorpay_subscription_id: subscriptionId,
//     });
//     console.log(payment);
//     const gap = Date.now() - payment.createdAt;

//     const refundTime = process.env.REFUND_DAYS * 24 * 60 * 60 * 1000;

//     if (refundTime > gap) {
//         await instance.payments.refund(payment.razorpay_payment_id);
//         refund = true;
//     }

//     await payment.deleteOne();
//     user.subscription.id = undefined;
//     user.subscription.status = undefined;
//     await user.save();

//     res.status(200).json({
//         success: true,
//         message: refund
//             ? "Subscription cancelled, You will receive full refund within 7 days."
//             : "Subscription cancelled, Now refund initiated as subscription was cancelled after 7 days.",
//     });
// });
