import mongoose from "mongoose";

const schema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    part1: [{
        id: String,
        name: String,
        symbol: String,
        CurrentPrice: Number,
        regularMarketChangeRS: Number,
        regularMarketPreviousClose: Number,
        regularMarketChangePercent: Number,
    }],
    part2: [{
        id: String,
        name: String,
        symbol: String,
        CurrentPrice: Number,
        regularMarketChangeRS: Number,
        regularMarketPreviousClose: Number,
        regularMarketChangePercent: Number,
    }],
    part3: [{
        id: String,
        name: String,
        symbol: String,
        CurrentPrice: Number,
        regularMarketChangeRS: Number,
        regularMarketPreviousClose: Number,
        regularMarketChangePercent: Number,
    }],
    part4: [{
        id: String,
        name: String,
        symbol: String,
        CurrentPrice: Number,
        regularMarketChangeRS: Number,
        regularMarketPreviousClose: Number,
        regularMarketChangePercent: Number,
    }],
    part5: [{
        id: String,
        name: String,
        symbol: String,
        CurrentPrice: Number,
        regularMarketChangeRS: Number,
        regularMarketPreviousClose: Number,
        regularMarketChangePercent: Number,
    }],
    part6: [{
        id: String,
        name: String,
        symbol: String,
        CurrentPrice: Number,
        regularMarketChangeRS: Number,
        regularMarketPreviousClose: Number,
        regularMarketChangePercent: Number,
    }],
    part7: [{
        id: String,
        name: String,
        symbol: String,
        CurrentPrice: Number,
        regularMarketChangeRS: Number,
        regularMarketPreviousClose: Number,
        regularMarketChangePercent: Number,
    }],
    part8: [{
        id: String,
        name: String,
        symbol: String,
        CurrentPrice: Number,
        regularMarketChangeRS: Number,
        regularMarketPreviousClose: Number,
        regularMarketChangePercent: Number,
    }],
    popular: [{
        id: String,
        name: String,
        symbol: String,
        CurrentPrice: Number,
        regularMarketChangeRS: Number,
        regularMarketPreviousClose: Number,
        regularMarketChangePercent: Number,
    }],
});

export const Stock = mongoose.model("Stock", schema);
