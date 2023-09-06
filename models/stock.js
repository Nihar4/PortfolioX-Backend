import mongoose from "mongoose";

const schema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    part1: [{
        name: String,
        symbol: String,
        CurrentPrice: Number,
        regularMarketChangeRS: Number,
        regularMarketPreviousClose: Number,
        regularMarketChangePercent: Number,
    }],
    part2: [{
        name: String,
        symbol: String,
        CurrentPrice: Number,
        regularMarketChangeRS: Number,
        regularMarketPreviousClose: Number,
        regularMarketChangePercent: Number,
    }],
    part3: [{
        name: String,
        symbol: String,
        CurrentPrice: Number,
        regularMarketChangeRS: Number,
        regularMarketPreviousClose: Number,
        regularMarketChangePercent: Number,
    }],
    part4: [{
        name: String,
        symbol: String,
        CurrentPrice: Number,
        regularMarketChangeRS: Number,
        regularMarketPreviousClose: Number,
        regularMarketChangePercent: Number,
    }],
    part5: [{
        name: String,
        symbol: String,
        CurrentPrice: Number,
        regularMarketChangeRS: Number,
        regularMarketPreviousClose: Number,
        regularMarketChangePercent: Number,
    }],
    part6: [{
        name: String,
        symbol: String,
        CurrentPrice: Number,
        regularMarketChangeRS: Number,
        regularMarketPreviousClose: Number,
        regularMarketChangePercent: Number,
    }],
});

export const Stock = mongoose.model("Stock", schema);
