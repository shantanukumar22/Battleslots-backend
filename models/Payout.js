import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  }, // Payout status
  createdAt: { type: Date, default: Date.now },
});

const Payout = mongoose.model("Payout", payoutSchema);

export default Payout;
