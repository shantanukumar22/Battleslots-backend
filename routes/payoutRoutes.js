import express from "express";
import {
  requestPayout,
  approvePayout,
  rejectPayout,
  getAllPayoutRequests,
} from "../controllers/payoutController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User: Request a payout
router.post("/request", protect, requestPayout);

// Admin: Approve payout
router.put("/approve/:payoutId", protect, adminOnly, approvePayout);

// Admin: View all payout requests
router.get("/", protect, adminOnly, getAllPayoutRequests);

// Admin: Reject payout
router.put("/reject/:payoutId", protect, adminOnly, rejectPayout);

export default router;
