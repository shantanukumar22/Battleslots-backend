import mongoose from "mongoose";

// Define the PaymentRequest Schema
const paymentRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
  amount: { type: Number, required: true }, // Amount requested
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"], // Status of the request
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now }, // Timestamp of request creation
});

// Create the PaymentRequest model
const PaymentRequest = mongoose.model("PaymentRequest", paymentRequestSchema);

export default PaymentRequest;
