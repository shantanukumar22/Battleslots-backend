import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["deposit", "booking", "payout", "prize"],
    required: true,
  },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["success", "pending", "failed"],
    default: "success",
  },
  remark: { type: String }, // optional message
  createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
