import mongoose from "mongoose";

const schema = new mongoose.Schema({

    paymentIntentId: {
        type: String,
        required: true,
    },
    subscriptionId: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Payment = mongoose.model("Payment", schema);
