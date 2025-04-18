import express from "express";
import {
  getUserTransactions,
  getAllTransactions,
} from "../controllers/transactionController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User: get own transactions
router.get("/my", protect, getUserTransactions);

// Admin: get all transactions
router.get("/all", protect, adminOnly, getAllTransactions);

export default router;
