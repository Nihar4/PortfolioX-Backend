import express from "express";
import { createAllStocksAll, getAllStocks, topGainer, topLosers } from "../controllers/stockController.js";
// import { createAllStocks, createAllStocks2, createAllStocks3, createAllStocks4, createAllStocksAll, deleteAllStocks, getAllStocks, mergeAllStocks, topGainer, topLosers } from "../controllers/stockController.js"

const router = express.Router();

// getallstocks
// router.route("/splitallstocks").get(splitAllStocks);

router.route("/createallstocks").post(createAllStocksAll);
// router.route("/createallstocks1").post(createAllStocks);
// router.route("/createallstocks2").post(createAllStocks2);
// router.route("/createallstocks3").post(createAllStocks3);
// router.route("/createallstocks4").post(createAllStocks4);

router.route("/getallstocks").get(getAllStocks);
// router.route("/mergeAllStocks").post(mergeAllStocks);

// router.route("/deleteallstocks").delete(deleteAllStocks);

router.route("/topgainer").get(topGainer);

router.route("/toplosers").get(topLosers);



export default router;
