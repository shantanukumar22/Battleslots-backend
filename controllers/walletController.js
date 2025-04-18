import User from "../models/User.js";
import { createTransaction } from "./transactionController.js"; // Add money to wallet
export const addMoneyToWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user.id); // Get logged-in user

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    user.walletBalance += amount; // Add the money to the wallet
    await user.save();
    await createTransaction(
      req.user.id,
      "deposit",
      amount,
      "success",
      "Wallet top-up"
    );

    res.status(200).json({
      message: `₹${amount} added to wallet`,
      balance: user.walletBalance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get wallet balance
export const getWalletBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("walletBalance"); // Only select walletBalance
    res.status(200).json({ balance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deduct money from wallet (used when booking a timeslot)
export const deductFromWallet = async (userId, amount) => {
  const user = await User.findById(userId);
  if (user.walletBalance < amount) {
    throw new Error("Insufficient balance");
  }
  user.walletBalance -= amount;
  await user.save();
  await createTransaction(
    userId,
    "booking",
    amount,
    "success",
    "Match booking deduction"
  );
  return user.walletBalance;
};
