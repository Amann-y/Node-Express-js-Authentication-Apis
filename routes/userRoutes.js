import express from "express";
import {
  loginController,
  registerController,
  getUserProfileController,
  logoutController,
  updateProfileController,
  updatePasswordController,
} from "../controllers/userControllers.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// register
router.post("/register", registerController);

//login
router.post("/login", loginController);

//profile
router.get("/profile", isAuth, getUserProfileController);

//logout
router.get("/logout", isAuth, logoutController);

//update profile
router.put("/profile-update", isAuth, updateProfileController);

//update password
router.put("/update-password", isAuth, updatePasswordController);

export default router;
