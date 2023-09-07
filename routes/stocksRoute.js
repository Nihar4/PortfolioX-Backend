import express from "express";
import { createAllStocksAll, createpopularstocks, getAllStocks, getpopular, topGainer, topLosers } from "../controllers/stockController.js";

const router = express.Router();



router.route("/createallstocks").post(createAllStocksAll);
router.route("/createpopularstocks").post(createpopularstocks);

router.route("/getallstocks").get(getAllStocks);
router.route("/getpopular").get(getpopular);
router.route("/topgainer").get(topGainer);
router.route("/toplosers").get(topLosers);



export default router;
