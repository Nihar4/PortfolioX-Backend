import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Stocks } from "../models/stock.js";
import axios from "axios";
import { Temp } from "../models/temp.js";


export const createAllStocksAll = catchAsyncError(async (req, res, next) => {
    try {
        const { number } = req.body;
        const response = await axios.get(
            "https://api.twelvedata.com/stocks?mic_code=XNSE&source=docs"
        );
        const data = response.data.data;

        const symbolsWithoutPeriod = data.filter(symbol => !symbol.symbol.includes("."));
        // console.log(symbolsWithoutPeriod.length);
        const totalSymbols = symbolsWithoutPeriod.length;
        const partSize = Math.ceil(totalSymbols / 4);

        // Divide the symbols into four parts
        const part1 = symbolsWithoutPeriod.slice(0, partSize).map((item) => item.symbol);
        const part2 = symbolsWithoutPeriod.slice(partSize, 2 * partSize).map((item) => item.symbol);
        const part3 = symbolsWithoutPeriod.slice(2 * partSize, 3 * partSize).map((item) => item.symbol);
        const part4 = symbolsWithoutPeriod.slice(3 * partSize, 4 * partSize).map((item) => item.symbol);
        // const part4 = symbolsWithoutPeriod.slice(1600, 1610).map((item) => item.symbol);


        // console.log(part);
        let part = [];
        switch (number) {
            case 1:
                part = part1;
                break;
            case 2:
                part = part2;
                break;
            case 3:
                part = part3;
                break;
            case 4:
                part = part4;
                break;

            default:
                res.status(404).json({
                    error: true,
                });
                break;
        }
        const logoData = await Promise.all(
            part.map(async (symbol) => {
                // console.log(symbol);
                const s = symbol + ".NS";
                // if (s !== "JTLINFRA.NS" && "KPIGLOBAL.NS") {
                const url = `https://query1.finance.yahoo.com/v7/finance/options/${s}?modules=financialData`;
                const url1 = `https://query1.finance.yahoo.com/v8/finance/chart/${s}?region=US&lang=en-US&includePrePost=false&interval=1d&range=5d&corsDomain=finance.yahoo.com&.tsrc=financed`
                return fetchStockDataWithRetries(url, url1);
                // }
            })
        );

        const filteredLogoData1 = logoData.filter((item) => item !== null);
        const filteredLogoData = filteredLogoData1.filter((item) => {
            try {
                if (
                    item.regularMarketChangeRS !== null &&
                    item.CurrentPrice !== null &&
                    item.regularMarketChangePercent !== null &&
                    item.regularMarketPreviousClose !== null
                ) {
                    return true;
                } else {
                    // Log the item that caused the error
                    // console.error('Invalid item:', item);
                    return false;
                }
            } catch (error) {
                // Log the error and the item that caused it
                console.error('Error processing item:', item, error);
                return false;
            }
        });

        const allpart = await Temp.find({});
        try {
            const result = await Temp.deleteMany({});
            console.log(`Deleted ${result.deletedCount} documents.`);
        } catch (error) {
            console.error('Error deleting documents:', error);
        }
        switch (number) {
            case 1:
                try {
                    const stocktemp = await Temp.create({
                        part1: filteredLogoData
                    });

                    // You can do something with the 'stock' instance here if needed
                } catch (error) {
                    console.error("Error creating stocktemp:", error);
                }

                break;
            case 2:
                try {
                    const stocktemp = await Temp.create({
                        part1: allpart[0].part1,
                        part2: filteredLogoData
                    });

                    // You can do something with the 'stock' instance here if needed
                } catch (error) {
                    console.error("Error creating stocktemp:", error);
                }
                break;
            case 3:
                try {
                    const stocktemp = await Temp.create({
                        part1: allpart[0].part1,
                        part2: allpart[0].part2,
                        part3: filteredLogoData
                    });

                    // You can do something with the 'stock' instance here if needed
                } catch (error) {
                    console.error("Error creating stocktemp:", error);
                }
                break;
            case 4:
                try {
                    const stocktemp = await Temp.create({
                        part1: allpart[0].part1,
                        part2: allpart[0].part2,
                        part3: allpart[0].part3,
                        part4: filteredLogoData
                    });

                    // You can do something with the 'stock' instance here if needed
                } catch (error) {
                    console.error("Error creating stocktemp:", error);
                }
                const alldata1 = await Temp.find({});
                // console.log(part2data[0].part2)

                mergeAllStocks(alldata1[0].part1, alldata1[0].part2, alldata1[0].part3, alldata1[0].part4);
                break;

            default:
                res.status(404).json({
                    error: true,
                });
                break;
        }

        res.status(201).json({
            success: true,
        });
    } catch (error) {
        console.log("error2 ", error);
        res.status(400).json({
            error: true,
        });
        return null;
    }
});

// export const createAllStocks = catchAsyncError(async (req, res, next) => {
//     try {
//         const response = await axios.get(
//             "https://api.twelvedata.com/stocks?mic_code=XNSE&source=docs"
//         );
//         const data = response.data.data;

//         const symbolsWithoutPeriod = data.filter(symbol => !symbol.symbol.includes("."));
//         console.log(symbolsWithoutPeriod.length);
//         const totalSymbols = symbolsWithoutPeriod.length;
//         const partSize = Math.ceil(totalSymbols / 4);

//         // Divide the symbols into four parts
//         const part1 = symbolsWithoutPeriod.slice(0, partSize).map((item) => item.symbol);
//         const part2 = symbolsWithoutPeriod.slice(partSize, 2 * partSize).map((item) => item.symbol);
//         const part3 = symbolsWithoutPeriod.slice(2 * partSize, 3 * partSize).map((item) => item.symbol);
//         const part4 = symbolsWithoutPeriod.slice(3 * partSize, 4 * partSize).map((item) => item.symbol);

//         // console.log(part);
//         const logoData = await Promise.all(
//             part1.map(async (symbol) => {
//                 // console.log(symbol);
//                 const s = symbol + ".NS";
//                 const url = `https://query1.finance.yahoo.com/v7/finance/options/${s}?modules=financialData`;
//                 const url1 = `https://query1.finance.yahoo.com/v8/finance/chart/${s}?region=US&lang=en-US&includePrePost=false&interval=1d&range=5d&corsDomain=finance.yahoo.com&.tsrc=financed`
//                 return fetchStockDataWithRetries(url, url1);
//             })
//         );

//         const filteredLogoData1 = logoData.filter((item) => item !== null);
//         const filteredLogoData = filteredLogoData1.filter(
//             (item) => item.regularMarketChangeRS !== null && item.CurrentPrice !== null && item.regularMarketChangePercent !== null && item.regularMarketPreviousClose !== null
//         );
//         try {
//             const result = await Temp.deleteMany({});
//             console.log(`Deleted ${result.deletedCount} documents.`);
//         } catch (error) {
//             console.error('Error deleting documents:', error);
//         }
//         try {
//             const stocktemp = await Temp.create({
//                 part1: filteredLogoData
//             });

//             // You can do something with the 'stock' instance here if needed
//         } catch (error) {
//             console.error("Error creating stocktemp:", error);
//         }

//         res.status(201).json({
//             success: true,
//         });
//     } catch (error) {
//         console.log("error2 ", error);
//         return null;
//     }
// });

// export const createAllStocks2 = catchAsyncError(async (req, res, next) => {
//     try {
//         const response = await axios.get(
//             "https://api.twelvedata.com/stocks?mic_code=XNSE&source=docs"
//         );
//         const data = response.data.data;

//         const symbolsWithoutPeriod = data.filter(symbol => !symbol.symbol.includes("."));
//         console.log(symbolsWithoutPeriod.length);
//         const totalSymbols = symbolsWithoutPeriod.length;
//         const partSize = Math.ceil(totalSymbols / 4);

//         // Divide the symbols into four parts
//         const part1 = symbolsWithoutPeriod.slice(0, partSize).map((item) => item.symbol);
//         const part2 = symbolsWithoutPeriod.slice(partSize, 2 * partSize).map((item) => item.symbol);
//         const part3 = symbolsWithoutPeriod.slice(2 * partSize, 3 * partSize).map((item) => item.symbol);
//         const part4 = symbolsWithoutPeriod.slice(3 * partSize, 4 * partSize).map((item) => item.symbol);

//         // console.log(part);
//         const logoData = await Promise.all(
//             part2.map(async (symbol) => {
//                 // console.log(symbol);
//                 const s = symbol + ".NS";
//                 // if (s !== "JTLINFRA.NS" && "KPIGLOBAL.NS") {
//                 const url = `https://query1.finance.yahoo.com/v7/finance/options/${s}?modules=financialData`;
//                 const url1 = `https://query1.finance.yahoo.com/v8/finance/chart/${s}?region=US&lang=en-US&includePrePost=false&interval=1d&range=5d&corsDomain=finance.yahoo.com&.tsrc=financed`
//                 return fetchStockDataWithRetries(url, url1);
//                 // }
//             })
//         );

//         const filteredLogoData1 = logoData.filter((item) => item !== null);
//         const filteredLogoData = filteredLogoData1.filter((item) => {
//             try {
//                 if (
//                     item.regularMarketChangeRS !== null &&
//                     item.CurrentPrice !== null &&
//                     item.regularMarketChangePercent !== null &&
//                     item.regularMarketPreviousClose !== null
//                 ) {
//                     return true;
//                 } else {
//                     // Log the item that caused the error
//                     // console.error('Invalid item:', item);
//                     return false;
//                 }
//             } catch (error) {
//                 // Log the error and the item that caused it
//                 console.error('Error processing item:', item, error);
//                 return false;
//             }
//         });

//         const allpart = await Temp.find({});
//         try {
//             const result = await Temp.deleteMany({});
//             console.log(`Deleted ${result.deletedCount} documents.`);
//         } catch (error) {
//             console.error('Error deleting documents:', error);
//         }
//         try {
//             const stocktemp = await Temp.create({
//                 part1: allpart[0].part1,
//                 part2: filteredLogoData
//             });

//             // You can do something with the 'stock' instance here if needed
//         } catch (error) {
//             console.error("Error creating stocktemp:", error);
//         }

//         res.status(201).json({
//             success: true,
//         });
//     } catch (error) {
//         console.log("error2 ", error);
//         res.status(400).json({
//             error: true,
//         });
//         return null;
//     }
// });

// export const createAllStocks3 = catchAsyncError(async (req, res, next) => {
//     try {
//         const response = await axios.get(
//             "https://api.twelvedata.com/stocks?mic_code=XNSE&source=docs"
//         );
//         const data = response.data.data;

//         const symbolsWithoutPeriod = data.filter(symbol => !symbol.symbol.includes("."));
//         console.log(symbolsWithoutPeriod.length);
//         const totalSymbols = symbolsWithoutPeriod.length;
//         const partSize = Math.ceil(totalSymbols / 4);

//         // Divide the symbols into four parts
//         const part1 = symbolsWithoutPeriod.slice(0, partSize).map((item) => item.symbol);
//         const part2 = symbolsWithoutPeriod.slice(partSize, 2 * partSize).map((item) => item.symbol);
//         const part3 = symbolsWithoutPeriod.slice(2 * partSize, 3 * partSize).map((item) => item.symbol);
//         const part4 = symbolsWithoutPeriod.slice(3 * partSize, 4 * partSize).map((item) => item.symbol);

//         // console.log(part);
//         const logoData = await Promise.all(
//             part3.map(async (symbol) => {
//                 // console.log(symbol);
//                 const s = symbol + ".NS";
//                 const url = `https://query1.finance.yahoo.com/v7/finance/options/${s}?modules=financialData`;
//                 const url1 = `https://query1.finance.yahoo.com/v8/finance/chart/${s}?region=US&lang=en-US&includePrePost=false&interval=1d&range=5d&corsDomain=finance.yahoo.com&.tsrc=financed`
//                 return fetchStockDataWithRetries(url, url1);
//             })
//         );

//         const filteredLogoData1 = logoData.filter((item) => item !== null);
//         const filteredLogoData = filteredLogoData1.filter(
//             (item) => item.regularMarketChangeRS !== null && item.CurrentPrice !== null && item.regularMarketChangePercent !== null && item.regularMarketPreviousClose !== null
//         );
//         const allpart = await Temp.find({});
//         try {
//             const result = await Temp.deleteMany({});
//             console.log(`Deleted ${result.deletedCount} documents.`);
//         } catch (error) {
//             console.error('Error deleting documents:', error);
//         }
//         try {
//             const stocktemp = await Temp.create({
//                 part1: allpart[0].part1,
//                 part2: allpart[0].part2,
//                 part3: filteredLogoData
//             });

//             // You can do something with the 'stock' instance here if needed
//         } catch (error) {
//             console.error("Error creating stocktemp:", error);
//         }

//         res.status(201).json({
//             success: true,
//         });
//     } catch (error) {
//         console.log("error2 ", error);
//         return null;
//     }
// });

// export const createAllStocks4 = catchAsyncError(async (req, res, next) => {
//     try {
//         const response = await axios.get(
//             "https://api.twelvedata.com/stocks?mic_code=XNSE&source=docs"
//         );
//         const data = response.data.data;

//         const symbolsWithoutPeriod = data.filter(symbol => !symbol.symbol.includes("."));
//         console.log(symbolsWithoutPeriod.length);
//         const totalSymbols = symbolsWithoutPeriod.length;
//         const partSize = Math.ceil(totalSymbols / 4);

//         // Divide the symbols into four parts
//         const part1 = symbolsWithoutPeriod.slice(0, partSize).map((item) => item.symbol);
//         const part2 = symbolsWithoutPeriod.slice(partSize, 2 * partSize).map((item) => item.symbol);
//         const part3 = symbolsWithoutPeriod.slice(2 * partSize, 3 * partSize).map((item) => item.symbol);
//         const part4 = symbolsWithoutPeriod.slice(3 * partSize, 4 * partSize).map((item) => item.symbol);


//         // console.log(part);
//         const logoData = await Promise.all(
//             part4.map(async (symbol) => {
//                 // console.log(symbol);
//                 const s = symbol + ".NS";
//                 const url = `https://query1.finance.yahoo.com/v7/finance/options/${s}?modules=financialData`;
//                 const url1 = `https://query1.finance.yahoo.com/v8/finance/chart/${s}?region=US&lang=en-US&includePrePost=false&interval=1d&range=5d&corsDomain=finance.yahoo.com&.tsrc=financed`
//                 return fetchStockDataWithRetries(url, url1);
//             })
//         );

//         const filteredLogoData1 = logoData.filter((item) => item !== null);
//         const filteredLogoData = filteredLogoData1.filter(
//             (item) => item.regularMarketChangeRS !== null && item.CurrentPrice !== null && item.regularMarketChangePercent !== null && item.regularMarketPreviousClose !== null
//         );
//         const allpart = await Temp.find({});
//         try {
//             const result = await Temp.deleteMany({});
//             console.log(`Deleted ${result.deletedCount} documents.`);
//         } catch (error) {
//             console.error('Error deleting documents:', error);
//         }
//         try {
//             const stocktemp = await Temp.create({
//                 part1: allpart[0].part1,
//                 part2: allpart[0].part2,
//                 part3: allpart[0].part3,
//                 part4: filteredLogoData
//             });

//             // You can do something with the 'stock' instance here if needed
//         } catch (error) {
//             console.error("Error creating stocktemp:", error);
//         }
//         const alldata1 = await Temp.find({});
//         // console.log(part2data[0].part2)

//         await axios.post('https://portfolio-x-two.vercel.app/api/v1/mergeAllStocks', { "part1data": alldata1[0].part1, "part2data": alldata1[0].part2, "part3data": alldata1[0].part3, "part4data": alldata1[0].part4 });
//         res.status(201).json({
//             success: true,
//         });
//     } catch (error) {
//         console.log("error2 ", error);
//         return null;
//     }
// });

const mergeAllStocks = async (part1data, part2data, part3data, part4data) => {
    // const { part1data, part2data, part3data, part4data } = req.body;

    // const part1data = req.body.part1data;
    // const part2data = req.body.part2data;
    // const part3data = req.body.part3data;
    // const part4data = req.body.part4data;
    // console.log(part1data);

    console.log(part1data.length, part2data.length, part3data.length, part4data.length);
    try {
        const result = await Stocks.deleteMany({});
        console.log(`Deleted ${result.deletedCount} documents.`);
    } catch (error) {
        console.error('Error deleting documents:', error);
    }
    await merge(part1data);
    await merge(part2data);
    await merge(part3data);
    await merge(part4data);
};

const merge = async (part) => {
    // console.log(part);
    part.forEach(async (data) => {
        try {
            const stock = await Stocks.create({
                // name: data.name,
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


const fetchStockDataWithRetries = async (url, url1) => {
    try {
        // const response1 = await axios.get(url);
        const response = await axios.get(url1);
        // console.log(
        //     response.data.chart.result[0].meta.regularMarketPrice,
        //     response.data.optionChain.result[0].quote.regularMarketChangePercent,
        //     response.data.optionChain.result[0].quote.regularMarketChange,
        //     response.data.chart.result[0].indicators.quote[0].close,
        //     response.data.optionChain.result[0].quote.symbol,
        //     response.data.optionChain.result[0].quote.longName,
        // );
        // console.log(response.data.chart);
        const closeArray = response.data.chart.result[0].indicators.quote[0].close;
        if (closeArray === undefined) { console.log("not found Array"); return null; }

        let secondToLastValue = 0, lastValue = 0;
        if (closeArray.length >= 2) {
            const lastTwoValues = closeArray.slice(-2);
            // Now, lastTwoValues contains the last two values of the array
            secondToLastValue = lastTwoValues[0];
            lastValue = lastTwoValues[1];

            // console.log("Second to last value:", secondToLastValue);
            // console.log("Last value:", lastValue);
        } else {
            // Handle the case where the array has fewer than 2 values
            console.log("Array has fewer than 2 values");
            return null;
        }
        // const name = response1.data.optionChain.result[0].quote.longName;
        const symbol = response.data.chart.result[0].meta.symbol;
        const CurrentPrice = response.data.chart.result[0].meta.regularMarketPrice;

        const regularMarketChangeRS = lastValue - secondToLastValue;
        const regularMarketChangePercent = secondToLastValue == null ? 0 : regularMarketChangeRS / secondToLastValue * 100;
        const regularMarketPreviousClose = secondToLastValue;

        // console.log(symbol, CurrentPrice, regularMarketChangeRS, regularMarketChangePercent, regularMarketPreviousClose);
        // const data = response.data.chart.result[0].meta.regularMarketPrice;

        return {
            // name: name,
            symbol: symbol,
            CurrentPrice: CurrentPrice === undefined ? null : CurrentPrice,
            regularMarketChangeRS: regularMarketChangeRS === undefined ? null : regularMarketChangeRS,
            regularMarketChangePercent: regularMarketChangePercent === undefined ? null : regularMarketChangePercent,
            regularMarketPreviousClose: regularMarketPreviousClose === undefined ? null : regularMarketPreviousClose,
        };
    } catch (error) {
        if (error.response && error.response.status === 429) {
            console.log("429");
            // If a 429 error is encountered, wait for a while before retrying
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 5 seconds (adjust as needed)
            // Then retry the request
            return fetchStockDataWithRetries(url, url1);

            // return null;
        } else {
            // Handle other errors
            console.log(`Error fetching data for ${url}:`, error);
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
        console.log('Error deleting documents:', error);
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


