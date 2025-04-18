import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
  time: { type: String, required: true },
  date: { type: Date, required: true },
  maxPlayers: { type: Number, default: 10 },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isResultDeclared: { type: Boolean, default: false }, // 👈 new field
  roomCode: { type: String, default: null }, // 👈 add this
});

const TimeSlot = mongoose.model("TimeSlot", timeSlotSchema);

export default TimeSlot;
