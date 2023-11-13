import express from "express";
import { BookmarkData, PortfolioData, createAllStocksAll, createpopularstocks, getAllStocks, getall } from "../controllers/stockController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();



router.route("/createallstocks").post(createAllStocksAll);
router.route("/createpopularstocks").post(createpopularstocks);
router.route("/getallstocks").get(getAllStocks);
router.route("/getall").get(getall);
router.route("/getbookmark").get(isAuthenticated, BookmarkData);
router.route("/getportfoliodata").get(isAuthenticated, PortfolioData);





export default router;
