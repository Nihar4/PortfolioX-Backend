import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import axios from "axios";
import { Stock } from "../models/stock.js";
import { Users } from "../models/user.js";

export const createAllStocksAll = catchAsyncError(async (req, res, next) => {
    try {
        const { number } = req.body;

        const responseNSE = await axios.get(
            "https://api.twelvedata.com/stocks?mic_code=XNSE&source=docs"
        );
        const dataNSE = responseNSE.data.data;

        const responseBSE = await axios.get(
            "https://api.twelvedata.com/stocks?mic_code=XBOM&source=docs"
        );
        const dataBSE = responseBSE.data.data;

        const alldatasymbol = dataNSE.concat(
            dataBSE.filter((itemBSE) => !dataNSE.some((itemNSE) => itemNSE.symbol === itemBSE.symbol))
        );

        const symbolsWithoutPeriod = alldatasymbol.filter(symbol => !symbol.symbol.includes("."));
        const totalSymbols = symbolsWithoutPeriod.length;
        const partSize = Math.ceil(totalSymbols / 8);

        const parts = [];
        for (let i = 0; i < 8; i++) {
            const part = symbolsWithoutPeriod
                .slice(i * partSize, (i + 1) * partSize)
                .map((item) => (item.exchange === 'NSE' ? item.symbol + '.NS' : item.exchange === 'BSE' ? item.symbol + '.BO' : item.symbol));

            parts.push(part);
        }

        if (number < 1 || number > 8) {
            return res.status(404).json({
                error: true,
            });
        }

        const partNumber = number - 1;
        const selectedPart = parts[partNumber];

        const logoData = await Promise.all(
            selectedPart.map(async (symbol) => {
                const url = `https://query1.finance.yahoo.com/v7/finance/options/${symbol}?modules=financialData`;
                const url1 = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?region=US&lang=en-US&includePrePost=false&interval=1d&range=5d&corsDomain=finance.yahoo.com&.tsrc=financed`
                return fetchStockDataWithRetries(url, url1);
            })
        );

        const filteredLogoData = logoData.filter((item) => (
            item !== null &&
            item.regularMarketChangeRS !== null &&
            item.CurrentPrice !== null &&
            item.regularMarketChangePercent !== null &&
            item.regularMarketPreviousClose !== null
        ));


        const allpart = await Stock.findOne({});

        switch (number) {
            case 1:
                allpart.part1 = filteredLogoData;
                break;
            case 2:
                allpart.part2 = filteredLogoData;
                break;
            case 3:
                allpart.part3 = filteredLogoData;
                break;
            case 4:
                allpart.part4 = filteredLogoData;
                break;
            case 5:
                allpart.part5 = filteredLogoData;
                break;
            case 6:
                allpart.part6 = filteredLogoData;
                break;
            case 7:
                allpart.part7 = filteredLogoData;
                break;
            case 8:
                allpart.part8 = filteredLogoData;
                break;
            default:
                return res.status(404).json({
                    error: true,
                });
        }

        allpart.createdAt = new Date(Date.now());
        await allpart.save();

        res.status(201).json({
            success: true,
        });
    } catch (error) {
        res.status(400).json({
            error: true,
        });
    }
});

export const createpopularstocks = catchAsyncError(async (req, res, next) => {
    const selectedPart = ["TCS.NS", "BHARTIARTL.NS", "TATAMOTORS.NS", "ITC.NS", "ICICIBANK.NS"]
    const logoData = await Promise.all(
        selectedPart.map(async (symbol) => {
            const url = `https://query1.finance.yahoo.com/v7/finance/options/${symbol}?modules=financialData`;
            const url1 = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?region=US&lang=en-US&includePrePost=false&interval=1d&range=5d&corsDomain=finance.yahoo.com&.tsrc=financed`
            return fetchStockDataWithRetries(url, url1);
        })
    );
    const filteredLogoData = logoData.filter((item) => (
        item !== null &&
        item.regularMarketChangeRS !== null &&
        item.CurrentPrice !== null &&
        item.regularMarketChangePercent !== null &&
        item.regularMarketPreviousClose !== null
    ));
    const allpart = await Stock.findOne({});
    allpart.popular = filteredLogoData;
    allpart.save();

    res.status(201).json({
        success: true,
    });
})

const fetchStockDataWithRetries = async (url, url1) => {
    try {
        const response = await axios.get(url1);
        const closeArray = response.data.chart.result[0].indicators.quote[0].close;
        if (closeArray === undefined) { return null; }

        let secondToLastValue = null, lastValue = null;
        if (closeArray.length >= 2) {
            const lastTwoValues = closeArray.slice(-2);
            secondToLastValue = lastTwoValues[0];
            lastValue = lastTwoValues[1];
        } else {
            return null;
        }
        if (secondToLastValue === null || lastValue === null) {
            return null;
        }
        const symbol = response.data.chart.result[0].meta.symbol;
        const CurrentPrice = response.data.chart.result[0].meta.regularMarketPrice;
        const regularMarketChangeRS = lastValue - secondToLastValue;
        const regularMarketChangePercent = secondToLastValue == null ? 0 : regularMarketChangeRS / secondToLastValue * 100;
        const regularMarketPreviousClose = secondToLastValue;

        return {
            symbol: symbol,
            CurrentPrice: CurrentPrice === undefined ? null : CurrentPrice,
            regularMarketChangeRS: regularMarketChangeRS === undefined ? null : regularMarketChangeRS,
            regularMarketChangePercent: regularMarketChangePercent === undefined ? null : regularMarketChangePercent,
            regularMarketPreviousClose: regularMarketPreviousClose === undefined ? null : regularMarketPreviousClose,
        };
    } catch (error) {
        if (error.response && error.response.status === 429) {
            return null;
        } else {
            return null;
        }
    }

}

export const BookmarkData = catchAsyncError(async (req, res, next) => {
    const user = await Users.findById(req.user._id);

    const logoData = await Promise.all(
        user.watchlist.map(async (symbol) => {
            const url = `https://query1.finance.yahoo.com/v7/finance/options/${symbol.symbol}?modules=financialData`;
            const url1 = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol.symbol}?region=US&lang=en-US&includePrePost=false&interval=1d&range=5d&corsDomain=finance.yahoo.com&.tsrc=financed`;

            const additionalData = await fetchAdditionalData(url);

            return {
                ...additionalData,
                ...await fetchStockDataWithRetries(url, url1)
            };
        })
    );

    res.status(200).json({
        success: true,
        logoData,
    });
});

export const PortfolioData = catchAsyncError(async (req, res, next) => {
    const user = await Users.findById(req.user._id);

    const logoData = await Promise.all(
        user.portfolio.map(async (symbol) => {
            const url1 = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol.symbol}?region=US&lang=en-US&includePrePost=false&interval=1d&range=5d&corsDomain=finance.yahoo.com&.tsrc=financed`;
            const response = await axios.get(url1);
            const CurrentPrice = response.data.chart.result[0].meta.regularMarketPrice;
            symbol.currentprice = CurrentPrice;

            return symbol;
        })
    );
    res.status(200).json({
        success: true,
        logoData,
    });
});




async function fetchAdditionalData(url) {
    try {
        const response1 = await axios.get(url);
        const name = response1.data.optionChain.result[0].quote.longName;

        return { name };
    } catch (error) {
        console.error('Error fetching additional data:', error);
        return { name: 'N/A' };
    }
}


export const getAllStocks = catchAsyncError(async (req, res, next) => {
    const stocks = await Stock.find({});

    const allStocks = [
        ...stocks[0].part1,
        ...stocks[0].part2,
        ...stocks[0].part3,
        ...stocks[0].part4,
        ...stocks[0].part5,
        ...stocks[0].part6,
        ...stocks[0].part7,
        ...stocks[0].part8,

    ];
    res.status(200).json({
        success: true,
        allStocks,
    });
});



const fetchTopGainer = async () => {
    const stocks = await Stock.find({});
    const allStocks = [
        ...stocks[0].part1,
        ...stocks[0].part2,
        ...stocks[0].part3,
        ...stocks[0].part4,
        ...stocks[0].part5,
        ...stocks[0].part6,
        ...stocks[0].part7,
        ...stocks[0].part8, // Include part5
        // Include part5
    ];
    allStocks.sort((a, b) => b.regularMarketChangePercent - a.regularMarketChangePercent);

    // Get the top 5 stocks
    let cnt = 0;
    let idx = 0;
    let topstocks = [];
    while (cnt < 5) {
        const s = allStocks[idx].symbol;
        const url = `https://query1.finance.yahoo.com/v7/finance/options/${s}?modules=financialData`;
        const response1 = await axios.get(url);
        try {
            let name = response1.data.optionChain.result[0].quote.longName;
            if (name === undefined || name === null) {
                console.log("not found")
            }
            else {
                let temp = allStocks[idx];
                temp.name = name;
                topstocks.push(temp)
                cnt = cnt + 1;
            }

        } catch (error) {
            console.log("name not found");
        }
        idx = idx + 1;

    }
    return topstocks
};

const fetchTopLosers = async () => {
    const stocks = await Stock.find({});
    const allStocks = [
        ...stocks[0].part1,
        ...stocks[0].part2,
        ...stocks[0].part3,
        ...stocks[0].part4,
        ...stocks[0].part5,
        ...stocks[0].part6,
        ...stocks[0].part7,
        ...stocks[0].part8,

    ];


    allStocks.sort((a, b) => a.regularMarketChangePercent - b.regularMarketChangePercent);

    let cnt = 0;
    let idx = 0;
    let topstocks = [];
    while (cnt < 5) {
        const s = allStocks[idx].symbol;
        const url = `https://query1.finance.yahoo.com/v7/finance/options/${s}?modules=financialData`;
        const response1 = await axios.get(url);
        try {
            let name = response1.data.optionChain.result[0].quote.longName;
            let temp = allStocks[idx];
            temp.name = name;
            topstocks.push(temp);
            cnt = cnt + 1;
        } catch (error) {
            console.log("name not found");
        }
        idx = idx + 1;

    }

    return topstocks

};

const fetchPopularStocks = async () => {
    const stocks = await Stock.find({});
    const allStocks = stocks[0].popular;
    let cnt = 0;
    let idx = 0;
    let topstocks = [];
    while (cnt < 5) {
        const s = allStocks[idx].symbol;
        const url = `https://query1.finance.yahoo.com/v7/finance/options/${s}?modules=financialData`;
        const response1 = await axios.get(url);
        try {
            let name = response1.data.optionChain.result[0].quote.longName;
            let temp = allStocks[idx];
            temp.name = name;
            topstocks.push(temp);
            cnt = cnt + 1;
        } catch (error) {
            console.log("name not found");
        }
        idx = idx + 1;

    }

    return topstocks
};

export const getall = async (req, res) => {
    try {
        const gainer = await fetchTopGainer();
        const loser = await fetchTopLosers();
        const popular = await fetchPopularStocks();

        res.status(200).json({ success: true, gainer, loser, popular });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};



