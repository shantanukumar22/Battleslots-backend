import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getCurrentUser,
  updateUpiId,
  updateUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

// Get user profile by id
router.get("/me", protect, getCurrentUser);
router.put("/update-upi-id", protect, updateUpiId); // Protect ensures user is authenticated
router.put("/update-profile", protect, updateUserProfile);

export default router;
