import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  viewPendingPayouts,
  approvePayout,
  rejectPayout,
} from "../controllers/adminPayoutController.js";

const router = express.Router();

// Admin routes to manage payouts
router.get("/pending", protect, adminOnly, viewPendingPayouts); // View pending payout requests
router.put("/approve/:payoutId", protect, adminOnly, approvePayout); // Approve payout request
router.put("/reject/:payoutId", protect, adminOnly, rejectPayout); // Reject payout request

export default router;
