import mongoose from "mongoose";

const matchResultSchema = new mongoose.Schema({
  timeSlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TimeSlot",
    required: true,
  },
  results: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      position: { type: Number }, // 1, 2, 3 etc.
      prize: { type: Number, default: 0 },
    },
  ],
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const MatchResult = mongoose.model("MatchResult", matchResultSchema);

export default MatchResult;
