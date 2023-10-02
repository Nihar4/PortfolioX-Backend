import express from "express";
import {
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
// router.route("/subscribe/cancel").delete(isAuthenticated, cancelSubscription);

export default router;
