import mongoose from "mongoose";

const schema = new mongoose.Schema({
    part1: [{
        // name: String,
        symbol: String,
        CurrentPrice: Number,
        regularMarketChangeRS: Number,
        regularMarketPreviousClose: Number,
        regularMarketChangePercent: Number,
    }],
    part2: [{
        // name: String,
        symbol: String,
        CurrentPrice: Number,
        regularMarketChangeRS: Number,
        regularMarketPreviousClose: Number,
        regularMarketChangePercent: Number,
    }],
    part3: [{
        // name: String,
        symbol: String,
        CurrentPrice: Number,
        regularMarketChangeRS: Number,
        regularMarketPreviousClose: Number,
        regularMarketChangePercent: Number,
    }],
    part4: [{
        // name: String,
        symbol: String,
        CurrentPrice: Number,
        regularMarketChangeRS: Number,
        regularMarketPreviousClose: Number,
        regularMarketChangePercent: Number,
    }],
});

export const Temp = mongoose.model("Temp", schema);
