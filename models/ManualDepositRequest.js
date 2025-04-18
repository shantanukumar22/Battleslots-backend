import mongoose from "mongoose";

const manualDepositRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const ManualDepositRequest = mongoose.model(
  "ManualDepositRequest",
  manualDepositRequestSchema
);

export default ManualDepositRequest;
