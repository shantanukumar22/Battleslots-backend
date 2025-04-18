import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import ManualDepositRequest from "../models/ManualDepositRequest.js";

export const createPaymentRequest = async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res
      .status(400)
      .json({ message: "Amount is required and must be greater than 0" });
  }

  try {
    const request = await ManualDepositRequest.create({
      user: req.user.id,
      amount,
      createdAt: new Date(),
    });

    res.status(201).json(request);
  } catch (err) {
    console.error("Error creating payment request:", err); // Log the error for debugging
    res.status(500).json({ message: err.message });
  }
};

// User creates a payment request with UPI ID

// Get all requests (admin)
// Get all requests (admin)
export const getAllPaymentRequests = async (req, res) => {
  const requests = await ManualDepositRequest.find().populate(
    "user",
    "username email upiId"
  ); // Add upiId to the user data
  res.json(requests);
};

// Approve request
export const approvePaymentRequest = async (req, res) => {
  const request = await ManualDepositRequest.findById(req.params.id).populate(
    "user"
  );
  if (!request) return res.status(404).json({ message: "Request not found" });
  if (request.status !== "pending")
    return res.status(400).json({ message: "Already processed" });

  request.status = "approved";
  await request.save();

  const user = request.user;
  user.walletBalance += request.amount;
  await user.save();

  await Transaction.create({
    user: user._id,
    type: "deposit",
    amount: request.amount,
    status: "success",
    remark: "Manual UPI Deposit",
  });

  res.json({ message: "Approved and wallet credited" });
};

// Reject request
export const rejectPaymentRequest = async (req, res) => {
  const request = await ManualDepositRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  if (request.status !== "pending")
    return res.status(400).json({ message: "Already processed" });

  request.status = "rejected";
  await request.save();

  res.json({ message: "Rejected successfully" });
};
