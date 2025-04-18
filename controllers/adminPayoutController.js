import Payout from "../models/Payout.js";
import User from "../models/User.js";
import { createTransaction } from "./transactionController.js";
// Admin: View all pending payout requests
export const viewPendingPayouts = async (req, res) => {
  try {
    const pendingPayouts = await Payout.find({ status: "pending" }).populate(
      "user",
      "username email"
    );
    res.status(200).json(pendingPayouts); // Return all pending payout requests
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Approve payout request
export const approvePayout = async (req, res) => {
  try {
    const { payoutId } = req.params;
    const payout = await Payout.findById(payoutId).populate("user");

    if (!payout)
      return res.status(404).json({ message: "Payout request not found" });
    if (payout.status !== "pending")
      return res.status(400).json({ message: "Payout already processed" });

    // Deduct the payout amount from the user's wallet
    const user = payout.user;
    if (user.walletBalance < payout.amount) {
      return res
        .status(400)
        .json({ message: "User doesn't have enough balance" });
    }

    user.walletBalance -= payout.amount; // Deduct from user's wallet
    await user.save();
    await createTransaction(
      user._id,
      "payout",
      payout.amount,
      "success",
      "Payout approved"
    );

    // Update payout status to 'approved'
    payout.status = "approved";
    await payout.save();

    res.status(200).json({ message: "Payout approved successfully", payout });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Reject payout request
export const rejectPayout = async (req, res) => {
  try {
    const { payoutId } = req.params;
    const payout = await Payout.findById(payoutId);

    if (!payout)
      return res.status(404).json({ message: "Payout request not found" });
    if (payout.status !== "pending")
      return res.status(400).json({ message: "Payout already processed" });

    // Update payout status to 'rejected'
    payout.status = "rejected";
    await payout.save();

    res.status(200).json({ message: "Payout rejected successfully", payout });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
