import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Users } from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
// import { instance } from "../server.js";
import crypto from "crypto";
import axios from "axios";

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
        amount: (parseFloat(quantity) * avgbuyingprice).toFixed(2) * 100,
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
            avgbuyingprice: parseFloat((((stock.quantity * stock.avgbuyingprice) + (stock2.quantity * stock2.avgbuyingprice)) / (stock2.quantity + stock.quantity)).toFixed(2)),
            subscription: {
                id: stock.subscription.id,
                status: "active"
            },
            quantityList: [...stock2.quantityList, stock.quantity],
            buyingPriceList: [...stock2.buyingPriceList, stock.avgbuyingprice],
            buyingDateList: [...stock2.buyingDateList, new Date()],
            status: [...stock2.status, "Buy"]

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
            },
            quantityList: [stock.quantity],
            buyingPriceList: [stock.avgbuyingprice],
            buyingDateList: [new Date()],
            status: ["Buy"]

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

export const SellStock = catchAsyncError(async (req, res, next) => {
    const user = await Users.findById(req.user._id);

    const { symbol, quantity } = req.body;
    const stockItem = user.portfolio.find((item) => item.symbol === symbol);
    const newPortfolio = user.portfolio.filter((item) => item.symbol !== symbol);
    const url1 = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?region=US&lang=en-US&includePrePost=false&interval=1d&range=5d&corsDomain=finance.yahoo.com&.tsrc=financed`
    const response = await axios.get(url1);

    const CurrentPrice = response.data.chart.result[0].meta.regularMarketPrice;
    // console.log("new", newPortfolio);
    // console.log(stockItem)
    if (stockItem.quantity > quantity) {
        newPortfolio.push({
            name: stockItem.name,
            symbol: stockItem.symbol,
            quantity: stockItem.quantity - quantity,
            avgbuyingprice: stockItem.avgbuyingprice,
            subscription: stockItem.subscription,
            quantityList: [...stockItem.quantityList, quantity],
            buyingPriceList: [...stockItem.buyingPriceList, CurrentPrice],
            buyingDateList: [...stockItem.buyingDateList, new Date()],
            status: [...stockItem.status, "Sell"]
        })
        user.portfolio = newPortfolio;
        await user.save();

    }
    else if (stockItem.quantity === quantity) {
        user.portfolio = newPortfolio;
        await user.save();

    }
    else {
        return next(new ErrorHandler("Quantity error", 400));
    }
    res.status(200).json({
        success: true,
        message: "Successfully Sell the Stock",

    });
});

