import express from "express";
import { createAllStocks, createAllStocks2, deleteAllStocks, getAllStocks, mergeAllStocks, topGainer, topLosers } from "../controllers/stockController.js"

const router = express.Router();

// getallstocks
// router.route("/splitallstocks").get(splitAllStocks);
router.route("/createallstocks1").get(createAllStocks);
router.route("/createallstocks2").get(createAllStocks2);
router.route("/getallstocks").get(getAllStocks);
router.route("/mergeAllStocks").post(mergeAllStocks);

router.route("/deleteallstocks").delete(deleteAllStocks);

router.route("/topgainer").get(topGainer);

router.route("/toplosers").get(topLosers);



export default router;
