import express from "express";
import {
  createTimeSlot,
  getAllTimeSlots,
  bookTimeSlot,
  deleteTimeSlot,
  getUserBookedSlots,
  declareMatchResults,
  setRoomCode,
} from "../controllers/timeslotController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a new slot (Admin only)
router.post("/create", protect, adminOnly, createTimeSlot);
router.put("/declare-results/:slotId", protect, adminOnly, declareMatchResults);

// Get all available slots
router.get("/", protect, getAllTimeSlots);

// Book a slot
router.post("/book/:slotId", protect, bookTimeSlot);

// Delete a slot (Admin only)
router.delete("/delete/:slotId", protect, adminOnly, deleteTimeSlot);

// Get slots booked by current user
router.get("/my-slots", protect, getUserBookedSlots);
router.put("/set-room-code/:slotId", protect, adminOnly, setRoomCode);

export default router;
