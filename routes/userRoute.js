import express from "express";
import {
    addToPlaylist,
    changePassword,
    contact,
    forgetPassword,
    getMyProfile,
    getReport,
    isBookmark,
    login,
    logout,
    register,
    removeFromPlaylist,
    resetPassword,
    updateProfile,
    updateprofilepicture,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);

router.route("/login").post(login);


router.route("/logout").get(logout);

router.route("/me").get(isAuthenticated, getMyProfile);

router.route("/changepassword").put(isAuthenticated, changePassword);


router.route("/updateprofile").put(isAuthenticated, updateProfile);


router
    .route("/updateprofilepicture")
    .put(singleUpload, isAuthenticated, updateprofilepicture);


router.route("/forgetpassword").post(forgetPassword);

router.route("/resetpassword").put(resetPassword);

router.route("/contact").post(contact);

router.route("/addtoplaylist").post(isAuthenticated, addToPlaylist);

router.route("/removefromplaylist").post(isAuthenticated, removeFromPlaylist);

router.route("/isbookmark").get(isAuthenticated, isBookmark);

router.route("/getreport").get(isAuthenticated, getReport);



export default router;