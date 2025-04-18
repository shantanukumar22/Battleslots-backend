import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  submitMatchResult,
  getAllMatchResults,
  getUserMatchResults,
} from "../controllers/matchResultController.js";

const router = express.Router();

// Admin: Submit match result
router.post("/submit", protect, adminOnly, submitMatchResult);

// Admin: View all match results
router.get("/all", protect, adminOnly, getAllMatchResults);

// User: View own match results
router.get("/my", protect, getUserMatchResults);

export default router;
