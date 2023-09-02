import express from "express";
import { createAllStocks, deleteAllStocks, getAllStocks, mergeAllStocks, splitAllStocks, topGainer, topLosers } from "../controllers/stockController.js"

const router = express.Router();

// getallstocks
router.route("/splitallstocks").get(splitAllStocks);
router.route("/createallstocks").post(createAllStocks);
router.route("/getallstocks").get(getAllStocks);
router.route("/mergeAllStocks").post(mergeAllStocks);

router.route("/deleteallstocks").delete(deleteAllStocks);

router.route("/topgainer").get(topGainer);

router.route("/toplosers").get(topLosers);



export default router;
