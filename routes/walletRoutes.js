import express from "express";
import {
  addMoneyToWallet,
  getWalletBalance,
} from "../controllers/walletController.js";
import { protect } from "../middlewares/authMiddleware.js"; // Protect routes

const router = express.Router();

// Route to add money to wallet
router.post("/add", protect, addMoneyToWallet);

// Route to get wallet balance
router.get("/balance", protect, getWalletBalance);

export default router;
