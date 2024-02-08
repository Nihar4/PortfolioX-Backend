import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Users } from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Payment } from "../models/payment.js";
import { stripe } from "../server.js";

export const buySubscription1 = catchAsyncError(async (req, res, next) => {

    const user = await Users.findById(req.user._id);
    const { name, symbol, quantity, avgbuyingprice, exchange, code } = req.body;

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
        },
        exchange: exchange, code: code
    })


    await user.save();
    const subscription_id = user.portfolio.find((user) => user.subscription.status === 'created');

});

export const paymentVerification1 = catchAsyncError(async (req, res, next) => {
    const { paymentIntentId, subscriptionId } =
        req.body;

    const user = await Users.findById(req.user._id);

    const stock = user.portfolio.find((user) => user.subscription.status === 'created');
    const subscription_id = stock.subscription.id;

    const isAuthentic = true;

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
            status: [...stock2.status, "Buy"],
            exchange: stock.exchange,
            code: stock.code

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
            status: ["Buy"],
            exchange: stock.exchange,
            code: stock.code

        })
        user.portfolio = newPortfolio;
    }


    user.History.push({
        name: stock.name,
        symbol: stock.symbol,
        quantity: stock.quantity,
        Price: stock.avgbuyingprice,
        status: "Buy",
        date: new Date(),
    })

    await user.save();

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

    const { symbol, quantity, CurrentPrice } = req.body;
    const stockItem = user.portfolio.find((item) => item.symbol === symbol);
    const newPortfolio = user.portfolio.filter((item) => item.symbol !== symbol);

    if (stockItem.quantity > Number(quantity)) {
        newPortfolio.push({
            name: stockItem.name,
            symbol: stockItem.symbol,
            quantity: stockItem.quantity - quantity,
            avgbuyingprice: stockItem.avgbuyingprice,
            subscription: stockItem.subscription,
            quantityList: [...stockItem.quantityList, quantity],
            buyingPriceList: [...stockItem.buyingPriceList, CurrentPrice],
            buyingDateList: [...stockItem.buyingDateList, new Date()],
            status: [...stockItem.status, "Sell"],
            exchange: stockItem.exchange,
            code: stockItem.code
        })
        user.portfolio = newPortfolio;

        user.History.push({
            name: stockItem.name,
            symbol: stockItem.symbol,
            quantity: quantity,
            Price: CurrentPrice,
            status: "Sell",
            date: new Date(),
        })

        await user.save();

    }
    else if (stockItem.quantity === Number(quantity)) {
        user.portfolio = newPortfolio;

        user.History.push({
            name: stockItem.name,
            symbol: stockItem.symbol,
            quantity: quantity,
            Price: CurrentPrice,
            status: "Sell",
            date: new Date(),
        })

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

