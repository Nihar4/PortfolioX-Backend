import express from "express";
import { BookmarkData, PortfolioData, createAllStocksAll, createpopularstocks, getAllStocks, getpopular, topGainer, topLosers } from "../controllers/stockController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();



router.route("/createallstocks").post(createAllStocksAll);
router.route("/createpopularstocks").post(createpopularstocks);

router.route("/getallstocks").get(getAllStocks);
router.route("/getpopular").get(getpopular);
router.route("/topgainer").get(topGainer);
router.route("/toplosers").get(topLosers);
router.route("/getbookmark").get(isAuthenticated, BookmarkData);
router.route("/getportfoliodata").get(isAuthenticated, PortfolioData);





export default router;
