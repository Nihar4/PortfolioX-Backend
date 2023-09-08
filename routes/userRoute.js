import express from "express";
import {
    addToPlaylist,
    changePassword,
    contact,
    forgetPassword,
    getMyProfile,
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

// // To register a new user
router.route("/register").post(singleUpload, register);

// // Login
router.route("/login").post(login);

// // logout
router.route("/logout").get(logout);


// // Get my profile
router.route("/me").get(isAuthenticated, getMyProfile);


// // ChangePassword
router.route("/changepassword").put(isAuthenticated, changePassword);

// // UpdateProfile
router.route("/updateprofile").put(isAuthenticated, updateProfile);

// // UpdateProfilePicture
router
    .route("/updateprofilepicture")
    .put(singleUpload, isAuthenticated, updateprofilepicture);

// // ForgetPassword
router.route("/forgetpassword").post(forgetPassword);
// // ResetPassword
router.route("/resetpassword").put(resetPassword);

router.route("/contact").post(contact);


// // AddtoPlaylist
router.route("/addtoplaylist").post(isAuthenticated, addToPlaylist);

// // RemoveFromPlaylist
router.route("/removefromplaylist").delete(isAuthenticated, removeFromPlaylist);

export default router;