// symbol , name , regularMarketChange RS, regularMarketPreviousClose , regularMarketChange Percentage

import mongoose from "mongoose";

const schema = new mongoose.Schema({
    // name: {
    //     type: String,
    //     default: "",
    // },
    symbol: {
        type: String,
        default: "",
    },
    CurrentPrice: {
        type: Number,
        default: 0,
    },

    regularMarketChangeRS: {
        type: Number,
        default: 0,
    },

    regularMarketPreviousClose: {
        type: Number,
        default: 0,
    },

    regularMarketChangePercent: {
        type: Number,
        default: 0,
    },
});

export const Stocks = mongoose.model("Stocks", schema);
