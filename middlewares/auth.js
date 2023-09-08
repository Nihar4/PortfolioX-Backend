import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "./catchAsyncError.js";
import { Users } from "../models/user.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    console.log(req.cookies);
    const { token } = req.cookies;
    console.log(token);
    if (!token) return next(new ErrorHandler("Not Logged In", 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await Users.findById(decoded._id);

    next();
});

// export const authorizeSubscribers = (req, res, next) => {
//     if (req.user.subscription.status !== "active" && req.user.role !== "admin")
//         return next(
//             new ErrorHandler(`Only Subscribers can acces this resource`, 403)
//         );

//     next();
// };

// export const authorizeAdmin = (req, res, next) => {
//     if (req.user.role !== "admin")
//         return next(
//             new ErrorHandler(
//                 `${req.user.role} is not allowed to access this resource`,
//                 403
//             )
//         );

//     next();
// };
