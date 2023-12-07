import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: validator.isEmail,
    },

    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Password must be at least 6 characters"],
        select: false,
    },

    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },

    watchlist: [
        {
            name: {
                type: String,
            },
            symbol: {
                type: String,
            },
            id: {
                type: String,
            },
        },
    ],
    portfolio: [
        {
            name: {
                type: String,
            },
            symbol: {
                type: String,
            },
            quantity: {
                type: Number
            },
            avgbuyingprice: {
                type: Number
            },
            currentprice: {
                type: Number
            },
            subscription: {
                id: String,
                status: String,
            },
            quantityList: {
                type: [Number],
            },
            buyingPriceList: {
                type: [Number],
            },
            status: {
                type: [String]
            },
            buyingDateList: {
                type: [Date],
            },
        },
    ],
    History: [
        {
            name: {
                type: String,
            },
            symbol: {
                type: String,
            },
            quantity: {
                type: Number
            },
            Price: {
                type: Number
            },
            status: {
                type: String
            },
            date: {
                type: Date
            }
        },
    ],

    // name symbol qnt price date 

    createdAt: {
        type: Date,
        default: Date.now,
    },

    otp: Number,
    otp_expire: Date,
});

schema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

schema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });
};

schema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

schema.methods.getResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

export const Users = mongoose.model("User", schema);
