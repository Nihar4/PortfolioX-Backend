import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Users } from "../models/user.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import cloudinary from "cloudinary";
import getDataUri from "../utils/dataUri.js";


export const register = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    const file = req.file;
    if (!name || !email || !password || !file)
        return next(new ErrorHandler("Please enter all field", 400));

    let user = await Users.findOne({ email });

    if (user) return next(new ErrorHandler("User Already Exist", 409));

    const fileUri = getDataUri(file);

    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

    user = await Users.create({
        name,
        email,
        password,
        avatar: {
            public_id: mycloud.public_id,
            url: mycloud.secure_url,
        },
    });
    sendToken(res, user, "Registered Successfully", 201);
});


export const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
        return next(new ErrorHandler("Please enter all field", 400));

    const user = await Users.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("Incorrect Email or Password", 401));

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
        return next(new ErrorHandler("Incorrect Email or Password", 401));

    sendToken(res, user, `Welcome back, ${user.name}`, 200);
});

export const logout = catchAsyncError(async (req, res, next) => {
    res
        .status(200)
        .cookie("token", "", {
            expires: new Date(Date.now()),
            httpOnly: false,
            secure: false,
            sameSite: false,
        })
        .json({
            success: true,
            message: "Logged Out Successfully",
        });
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
    const user = await Users.findById(req.user._id);

    res.status(200).json({
        success: true,
        user,
    });
});

export const changePassword = catchAsyncError(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
        return next(new ErrorHandler("Please enter all field", 400));

    const user = await Users.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) return next(new ErrorHandler("Incorrect Old Password", 400));

    user.password = newPassword;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password Changed Successfully",
    });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
    const { name, email } = req.body;

    const user = await Users.findById(req.user._id);

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
    });
});

export const updateprofilepicture = catchAsyncError(async (req, res, next) => {
    const file = req.file;
    if (!file) {
        return next(new ErrorHandler("Please Select the Image TO Update ", 400));
    }
    const user = await Users.findById(req.user._id);

    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    user.avatar = {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
    };

    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile Picture Updated Successfully",
    });
});

export const forgetPassword = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;
    const user = await Users.findOne({ email });

    if (!user) return next(new ErrorHandler("Incorrect Email", 404));
    const randomNumber = Math.random() * (999999 - 100000) + 100000;
    const otp = Math.floor(randomNumber);
    const otp_expire = 15 * 60 * 1000;

    user.otp = otp;
    user.otp_expire = new Date(Date.now() + otp_expire);
    await user.save();

    const message = `Your OTP for Reseting Password is ${otp}.\n Please ignore if you haven't requested this.`;
    try {
        await sendEmail(user.email, "OTP For Reseting Password", message);
    } catch (error) {
        user.otp = null;
        user.otp_expire = null;
        await user.save();
        return next(error);
    }

    res.status(200).json({
        success: true,
        message: `Email Sent To ${user.email}`,
    });
});


export const resetPassword = catchAsyncError(async (req, res, next) => {
    const { otp, password } = req.body;

    const user = await Users.findOne({
        otp,
        otp_expire: {
            $gt: Date.now(),
        },
    });

    if (!user)
        return next(new ErrorHandler("Incorrect OTP or has been expired", 400));

    if (!password)
        return next(new ErrorHandler("Please Enter New Password", 400));

    user.password = password;
    user.otp = undefined;
    user.otp_expire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password Changed Successfully, You can login now",
    });
});

export const addToPlaylist = catchAsyncError(async (req, res, next) => {
    const user = await Users.findById(req.user._id);
    const { name, symbol, exchange, code, logo } = req.body;
    user.watchlist.push({
        name: name,
        symbol: symbol,
        exchange: exchange,
        code: code,
        logo: logo
    });

    await user.save();

    res.status(200).json({
        success: true,
        message: "Added to watchlist",
    });
});

export const isBookmark = catchAsyncError(async (req, res, next) => {
    const user = await Users.findById(req.user._id);
    const { name, symbol } = req.body;
    let Bookmark = false;
    user.watchlist.map((item, index) => {
        if (item.name === name && item.symbol === symbol) {
            Bookmark = true;
            return;
        }
    })
    res.status(200).json({
        success: true,
        Bookmark,
    });
});

export const removeFromPlaylist = catchAsyncError(async (req, res, next) => {
    const user = await Users.findById(req.user._id);
    const { name, symbol, exchange, code } = req.body;
    const newWatchlist = user.watchlist.filter((item) => {
        if (item.symbol !== symbol) return item;
    });

    user.watchlist = newWatchlist;
    await user.save();
    res.status(200).json({
        success: true,
        message: "Removed From Watchlist",
    });
});

export const contact = catchAsyncError(async (req, res, next) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message)
        return next(new ErrorHandler("All fields are mandatory", 400));

    const to = process.env.MY_MAIL;
    const subject = "Contact from PortfolioX";
    const text = `I am ${name} and my Email is ${email}. \n${message}`;

    await sendEmail(email, subject, text);

    res.status(200).json({
        success: true,
        message: "Your Message Has Been Sent.",
    });
});

export const getReport = catchAsyncError(async (req, res, next) => {
    const user = await Users.findById(req.user._id);
    const { from, to } = req.body;
    const report = []
    const fromDate = new Date(
        from.split("/").reverse().join("-") + "T00:00:00Z"
    );
    const toDate = new Date(
        to.split("/").reverse().join("-") + "T23:59:59Z"
    );
    if (fromDate > toDate) {
        return next(new ErrorHandler("Please Enter Valid Date", 400));
    }
    if (user.History.length > 0) {
        user.History.map((item, index) => {
            const item1Date = new Date(item.date);
            if (item1Date >= fromDate && item1Date <= toDate) {
                const temp = {
                    name: item.name,
                    symbol: item.symbol,
                    quantity: item.quantity,
                    buyingprice: item.Price,
                    status: item.status,
                    date: item1Date
                }
                report.push(temp);
            }

        });
    }
    res.status(200).json({
        success: true,
        report,
    });
});
