import express from "express";
import {
    SellStock,
    // buySubscription,
    buySubscription1,
    // cancelSubscription,
    getRazorPayKey,
    // paymentVerification,
    paymentVerification1,
} from "../controllers/paymentController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Buy Subscription
// router.route("/subscribe").post(isAuthenticated, buySubscription);

router.route("/subscribe").post(isAuthenticated, buySubscription1);


// Verify Payment and save reference in database
// router.route("/paymentverification").post(isAuthenticated, paymentVerification);
router.route("/paymentverification").post(isAuthenticated, paymentVerification1);


// Get Razorpay key
router.route("/razorpaykey").get(getRazorPayKey);

// Cancel Subscription
router.route("/sellstock").put(isAuthenticated, SellStock);

export default router;
