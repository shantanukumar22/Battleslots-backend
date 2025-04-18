import TimeSlot from "../models/TimeSlot.js";
import { deductFromWallet } from "./walletController.js";
// Create a new timeslot (admin)
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const getUserBookedSlots = async (req, res) => {
  try {
    console.log("getUserBookedSlots called for user:", req.user.id);
    const bookedSlots = await TimeSlot.find({ players: req.user.id });
    res.status(200).json(bookedSlots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const createTimeSlot = async (req, res) => {
  try {
    console.log("createTimeSlot called with body:", req.body);
    const { time, date, maxPlayers } = req.body;
    const newSlot = new TimeSlot({ time, date, maxPlayers });
    await newSlot.save();
    res.status(201).json(newSlot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all timeslots
export const getAllTimeSlots = async (req, res) => {
  try {
    console.log("getAllTimeSlots called");
    const slots = await TimeSlot.find().populate(
      "players",
      "username valorantName email walletBalance"
    );
    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Book a timeslot (user)
export const bookTimeSlot = async (req, res) => {
  try {
    console.log("bookTimeSlot called with params:", req.params);
    const { slotId } = req.params; // Get the time slot ID from the request
    const userId = req.user.id; // Get the logged-in user ID from the JWT token

    // Fetch the time slot and include the results
    const slot = await TimeSlot.findById(slotId);
    if (!slot) return res.status(404).json({ message: "Timeslot not found" });

    // Check if the match result has already been declared
    if (slot.isResultDeclared) {
      console.log(`Booking attempt after results declared for slot ${slotId}`);
      return res.status(400).json({
        message:
          "Match results have already been declared. No further bookings allowed.",
      });
    }

    // Check if the user has already booked this slot
    if (slot.players.includes(userId))
      return res.status(400).json({ message: "You already booked this slot" });

    // Check if the slot is full
    if (slot.players.length >= slot.maxPlayers)
      return res.status(400).json({ message: "Slot is full" });

    // **Step 1: Verify wallet balance and deduct ₹70**
    await deductFromWallet(userId, 70); // Deduct ₹70 from the wallet

    // **Step 2: Add the user to the time slot**
    slot.players.push(userId);
    await slot.save();

    console.log(`User ${userId} successfully booked slot ${slotId}`);

    // Respond with success message
    res
      .status(200)
      .json({ message: "Slot booked and ₹70 deducted from wallet", slot });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Delete a timeslot (admin only)
export const deleteTimeSlot = async (req, res) => {
  try {
    console.log("deleteTimeSlot called with slotId:", req.params.slotId);
    const { slotId } = req.params;
    const slot = await TimeSlot.findByIdAndDelete(slotId);

    if (!slot) {
      return res.status(404).json({ message: "Timeslot not found" });
    }

    res.status(200).json({ message: "Timeslot deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ! declaring the match results
export const declareMatchResults = async (req, res) => {
  try {
    console.log("declareMatchResults called with params:", req.params);
    const { slotId } = req.params;
    const { prizes } = req.body; // prizes = [{ userId, amount }]

    const slot = await TimeSlot.findById(slotId).populate("players");
    if (!slot) return res.status(404).json({ message: "Time slot not found" });

    // Update each player's wallet & transaction
    for (const prize of prizes) {
      const user = await User.findById(prize.userId);
      if (!user) continue;

      user.walletBalance += prize.amount;
      await user.save();

      const transaction = new Transaction({
        user: user._id,
        type: "prize",
        amount: prize.amount,
        status: "success",
        remark: `Prize credited for match at ${slot.time}`,
      });
      await transaction.save();

      console.log(`Prize of ₹${prize.amount} distributed to ${user.username}`);
    }

    // Mark the slot result as declared
    slot.isResultDeclared = true;
    await slot.save();
    console.log(`Result declared for slot ${slotId}`);

    res.status(200).json({ message: "Prizes distributed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const setRoomCode = async (req, res) => {
  try {
    const { roomCode } = req.body;
    const slot = await TimeSlot.findById(req.params.slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    slot.roomCode = roomCode;
    await slot.save();

    res.json({ message: "Room code updated", slot });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
