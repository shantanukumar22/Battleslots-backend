import express from "express";
import {
  createPaymentRequest,
  getAllPaymentRequests,
  approvePaymentRequest,
  rejectPaymentRequest,
} from "../controllers/paymentController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/request", protect, createPaymentRequest);
router.get("/requests", protect, adminOnly, getAllPaymentRequests);
router.put("/approve/:id", protect, adminOnly, approvePaymentRequest);
router.put("/reject/:id", protect, adminOnly, rejectPaymentRequest);

export default router;
