import express from "express";
import {
    SellStock,
    buySubscription1,
    getRazorPayKey,
    paymentVerification1,
} from "../controllers/paymentController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/subscribe").post(isAuthenticated, buySubscription1);

router.route("/paymentverification").post(isAuthenticated, paymentVerification1);

router.route("/razorpaykey").get(getRazorPayKey);

router.route("/sellstock").put(isAuthenticated, SellStock);

export default router;
