import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Stocks } from "../models/stock.js";
import axios from "axios";

export const splitAllStocks = catchAsyncError(async (req, res, next) => {
    try {
        const response = await axios.get(
            "https://api.twelvedata.com/stocks?mic_code=XNSE&source=docs"
        );
        const data = response.data.data;

        const symbolsWithoutPeriod = data.filter(symbol => !symbol.symbol.includes("."));

        const totalSymbols = symbolsWithoutPeriod.length;
        const partSize = Math.ceil(totalSymbols / 4);

        // Divide the symbols into four parts
        const part1 = symbolsWithoutPeriod.slice(0, partSize).map((item) => item.symbol);
        const part2 = symbolsWithoutPeriod.slice(partSize, 2 * partSize).map((item) => item.symbol);
        const part3 = symbolsWithoutPeriod.slice(2 * partSize, 3 * partSize).map((item) => item.symbol);
        const part4 = symbolsWithoutPeriod.slice(3 * partSize).map((item) => item.symbol);

        res.status(201).json({
            success: true,
            part1, part2, part3, part4
        });
    }
    catch (error) {
        console.log("enable to split ", error);
    }
});

export const createAllStocks = catchAsyncError(async (req, res, next) => {
    try {
        const part = req.body.part;
        // console.log(part);
        const logoData = await Promise.all(
            part.map(async (symbol) => {
                // console.log(symbol);
                const s = symbol + ".NS";
                const url = `https://query1.finance.yahoo.com/v7/finance/options/${s}?modules=financialData`;
                return fetchStockDataWithRetries(url);
            })
        );
        const filteredLogoData1 = logoData.filter((item) => item !== null);
        const filteredLogoData = filteredLogoData1.filter(
            (item) => item.regularMarketChangeRS !== null && item.CurrentPrice !== null && item.regularMarketChangePercent !== null && item.regularMarketPreviousClose !== null
        );
        // try {
        //     const result = await Stocks.deleteMany({});
        //     console.log(`Deleted ${result.deletedCount} documents.`);
        // } catch (error) {
        //     console.error('Error deleting documents:', error);
        // }
        // filteredLogoData.forEach(async (data) => {
        //     try {
        //         const stock = await Stocks.create({
        //             name: data.name,
        //             symbol: data.symbol,
        //             CurrentPrice: data.CurrentPrice,
        //             regularMarketChangeRS: data.regularMarketChangeRS,
        //             regularMarketPreviousClose: data.regularMarketPreviousClose,
        //             regularMarketChangePercent: data.regularMarketChangePercent
        //         });

        //         // You can do something with the 'stock' instance here if needed
        //     } catch (error) {
        //         console.error("Error creating stock:", error);
        //     }
        // });
        res.status(201).json({
            success: true,
            filteredLogoData
        });
    } catch (error) {
        console.log("error2 ", error);
        return null;
    }
});

export const mergeAllStocks = catchAsyncError(async (req, res, next) => {
    const { part1data, part2data, part3data, part4data } = req.body;
    try {
        const result = await Stocks.deleteMany({});
        console.log(`Deleted ${result.deletedCount} documents.`);
    } catch (error) {
        console.error('Error deleting documents:', error);
    }
    merge(part1data);
    merge(part2data);
    merge(part3data);
    merge(part4data);

    res.status(201).json({
        success: true,
        message: "stocks Created Successfully.",
    });

});

const merge = async (part) => {
    part.forEach(async (data) => {
        try {
            const stock = await Stocks.create({
                name: data.name,
                symbol: data.symbol,
                CurrentPrice: data.CurrentPrice,
                regularMarketChangeRS: data.regularMarketChangeRS,
                regularMarketPreviousClose: data.regularMarketPreviousClose,
                regularMarketChangePercent: data.regularMarketChangePercent
            });

            // You can do something with the 'stock' instance here if needed
        } catch (error) {
            console.error("Error creating stock:", error);
        }
    });
}
const fetchStockDataWithRetries = async (url) => {
    try {
        const response = await axios.get(url);
        console.log(
            response.data.optionChain.result[0].quote.regularMarketPrice,
            response.data.optionChain.result[0].quote.regularMarketChangePercent,
            response.data.optionChain.result[0].quote.regularMarketChange,
            response.data.optionChain.result[0].quote.regularMarketPreviousClose,
            response.data.optionChain.result[0].quote.symbol,
            response.data.optionChain.result[0].quote.longName,
        );

        const name = response.data.optionChain.result[0].quote.longName;
        const symbol = response.data.optionChain.result[0].quote.symbol;
        const CurrentPrice = response.data.optionChain.result[0].quote.regularMarketPrice;
        const regularMarketChangeRS = response.data.optionChain.result[0].quote.regularMarketChange;
        const regularMarketChangePercent = response.data.optionChain.result[0].quote.regularMarketChangePercent;
        const regularMarketPreviousClose = response.data.optionChain.result[0].quote.regularMarketPreviousClose;
        // const data = response.data.chart.result[0].meta.regularMarketPrice;

        return {
            name: name,
            symbol: symbol,
            CurrentPrice: CurrentPrice === undefined ? null : CurrentPrice,
            regularMarketChangeRS: regularMarketChangeRS === undefined ? null : regularMarketChangeRS,
            regularMarketChangePercent: regularMarketChangePercent === undefined ? null : regularMarketChangePercent,
            regularMarketPreviousClose: regularMarketPreviousClose === undefined ? null : regularMarketPreviousClose,
        };
    } catch (error) {
        if (error.response && error.response.status === 429) {
            console.error("429");
            // If a 429 error is encountered, wait for a while before retrying
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 5 seconds (adjust as needed)
            // Then retry the request
            return fetchStockDataWithRetries(url);

            // return null;
        } else {
            // Handle other errors
            console.error(`Error fetching data for ${url}:`, error);
            return null;
        }
        // return null;
    }

}
export const getAllStocks = catchAsyncError(async (req, res, next) => {
    const stocks = await Stocks.find({
    });
    res.status(200).json({
        success: true,
        stocks,
    });
});

export const deleteAllStocks = catchAsyncError(async (req, res, next) => {
    try {
        const result = await Stocks.deleteMany({});
        console.log(`Deleted ${result.deletedCount} documents.`);
    } catch (error) {
        console.error('Error deleting documents:', error);
    }
    res.status(200).json({
        success: true,
        message: "Deleted Succesfully"
    });
});

export const topGainer = catchAsyncError(async (req, res, next) => {
    const stocks = await Stocks.find({
    });
    stocks.sort((a, b) => b.regularMarketChangePercent - a.regularMarketChangePercent);

    // Get the top 5 stocks
    const top5Stocks = stocks.slice(0, 5);
    res.status(200).json({
        success: true,
        top5Stocks,
    });
});


export const topLosers = catchAsyncError(async (req, res, next) => {
    const stocks = await Stocks.find({});

    // Sort the stocks by regularMarketChangePercent in ascending order
    stocks.sort((a, b) => a.regularMarketChangePercent - b.regularMarketChangePercent);

    // Get the top 5 stocks (these will be the top losers)
    const top5Stocks = stocks.slice(0, 5);

    res.status(200).json({
        success: true,
        top5Stocks,
    });
});


