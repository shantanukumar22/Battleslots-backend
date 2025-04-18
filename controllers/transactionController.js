import Transaction from "../models/Transaction.js";

// Create a transaction record
export const createTransaction = async (
  userId,
  type,
  amount,
  status = "success",
  remark = ""
) => {
  const newTxn = new Transaction({
    user: userId,
    type,
    amount,
    status,
    remark,
  });
  await newTxn.save();
};

// Get transaction history (for a user)
export const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get all transactions
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("user", "username email")
      .sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
