// import Payout from "../models/Payout.js";
// import User from "../models/User.js";

// // Request a payout (user)
// export const requestPayout = async (req, res) => {
//   try {
//     const { amount } = req.body;
//     const user = await User.findById(req.user.id);

//     // Check if the user has enough balance
//     if (user.walletBalance < amount) {
//       return res
//         .status(400)
//         .json({ message: "Insufficient balance for payout" });
//     }

//     // Create a payout request
//     const newPayout = new Payout({
//       user: req.user.id,
//       amount,
//       status: "pending",
//     });

//     await newPayout.save();

//     // Optional: Deduct the amount from the user's wallet immediately if you want to process payout requests after approval.
//     // user.walletBalance -= amount;
//     // await user.save();

//     res
//       .status(200)
//       .json({ message: "Payout request created successfully", newPayout });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Approve payout request (admin)
// import Transaction from "../models/Transaction.js";

// export const approvePayout = async (req, res) => {
//   try {
//     const { payoutId } = req.params;
//     const payout = await Payout.findById(payoutId).populate("user");

//     if (!payout)
//       return res.status(404).json({ message: "Payout request not found" });

//     if (payout.status !== "pending")
//       return res.status(400).json({ message: "Payout already processed" });

//     const user = payout.user;

//     if (user.walletBalance < payout.amount)
//       return res
//         .status(400)
//         .json({ message: "User has insufficient balance at approval" });

//     // Deduct from wallet
//     user.walletBalance -= payout.amount;
//     await user.save();

//     // Create transaction entry (✅ corrected status)
//     const transaction = new Transaction({
//       user: user._id,
//       type: "payout",
//       amount: payout.amount,
//       status: "success", // ✅ FIXED THIS LINE
//       remark: "Payout approved by admin",
//     });
//     await transaction.save();

//     // Approve payout
//     payout.status = "approved";
//     await payout.save();

//     res.status(200).json({
//       message: "Payout approved successfully",
//       payout,
//       transaction,
//     });
//   } catch (err) {
//     console.error("Approval error details:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
// // Reject payout request (admin)
// export const rejectPayout = async (req, res) => {
//   try {
//     const { payoutId } = req.params;
//     const payout = await Payout.findById(payoutId);

//     if (!payout)
//       return res.status(404).json({ message: "Payout request not found" });
//     if (payout.status !== "pending")
//       return res.status(400).json({ message: "Payout already processed" });

//     // Update payout status
//     payout.status = "rejected";
//     await payout.save();

//     res.status(200).json({ message: "Payout rejected successfully", payout });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// // Get all payout requests (admin)
// export const getAllPayoutRequests = async (req, res) => {
//   try {
//     const payouts = await Payout.find().populate(
//       "user",
//       "username email walletBalance"
//     );
//     res.status(200).json(payouts);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// // };

// import Payout from "../models/Payout.js";
// import User from "../models/User.js";
// import Transaction from "../models/Transaction.js";

// // Request a payout (user)
// // In controllers/payoutController.js
// export const requestPayout = async (req, res) => {
//   try {
//     const { amount } = req.body;
//     const user = await User.findById(req.user.id);

//     // If the user hasn't provided UPI ID, ask for it
//     if (!user.upiId) {
//       return res
//         .status(400)
//         .json({ message: "Please provide your UPI ID first." });
//     }

//     // Proceed if sufficient balance
//     if (user.walletBalance < amount) {
//       return res
//         .status(400)
//         .json({ message: "Insufficient balance for payout" });
//     }

//     const newPayout = new Payout({
//       user: req.user.id,
//       amount,
//       status: "pending",
//     });

//     await newPayout.save();

//     const transaction = new Transaction({
//       user: req.user.id,
//       type: "payout",
//       amount,
//       status: "pending",
//       remark: "Payout requested by user",
//     });

//     await transaction.save();

//     res.status(200).json({
//       message: "Payout request created successfully",
//       newPayout,
//       transaction,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Approve payout request (admin)
// export const approvePayout = async (req, res) => {
//   try {
//     const { payoutId } = req.params;
//     const payout = await Payout.findById(payoutId).populate("user");

//     if (!payout)
//       return res.status(404).json({ message: "Payout request not found" });
//     if (payout.status !== "pending")
//       return res.status(400).json({ message: "Payout already processed" });

//     const user = payout.user;

//     if (user.walletBalance < payout.amount)
//       return res
//         .status(400)
//         .json({ message: "User has insufficient balance at approval" });

//     user.walletBalance -= payout.amount;
//     await user.save();

//     // Update related transaction to success
//     const transaction = await Transaction.findOne({
//       user: user._id,
//       amount: payout.amount,
//       type: "payout",
//       status: "pending",
//     });

//     if (transaction) {
//       transaction.status = "success";
//       transaction.remark = "Payout approved by admin";
//       await transaction.save();
//     }

//     payout.status = "approved";
//     await payout.save();

//     res.status(200).json({
//       message: "Payout approved successfully",
//       payout,
//       transaction,
//     });
//   } catch (err) {
//     console.error("Approval error details:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // Reject payout request (admin)
// export const rejectPayout = async (req, res) => {
//   try {
//     const { payoutId } = req.params;
//     const payout = await Payout.findById(payoutId);

//     if (!payout)
//       return res.status(404).json({ message: "Payout request not found" });
//     if (payout.status !== "pending")
//       return res.status(400).json({ message: "Payout already processed" });

//     // Update related transaction to failed
//     const transaction = await Transaction.findOne({
//       user: payout.user,
//       amount: payout.amount,
//       type: "payout",
//       status: "pending",
//     });

//     if (transaction) {
//       transaction.status = "failed";
//       transaction.remark = "Payout rejected by admin";
//       await transaction.save();
//     }

//     payout.status = "rejected";
//     await payout.save();

//     res.status(200).json({
//       message: "Payout rejected successfully",
//       payout,
//       transaction,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get all payout requests (admin)
import User from "../models/User.js";
import Payout from "../models/Payout.js";
import Transaction from "../models/Transaction.js";

// User: Request a payout

export const requestPayout = async (req, res) => {
  try {
    const { amount } = req.body;
    const minimumWithdrawAmount = 100;

    const user = await User.findById(req.user.id);

    if (!user.upiId) {
      return res.status(400).json({ message: "UPI ID not set for user" });
    }

    if (user.walletBalance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    if (amount < minimumWithdrawAmount) {
      return res
        .status(400)
        .json({ message: "payout should be of atleast 100" });
    }

    const payoutRequest = new Payout({
      user: req.user.id,
      upiId: user.upiId,
      amount,
      status: "pending",
    });

    await payoutRequest.save();
    res.status(200).json({ message: "Payout request created", payoutRequest });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Approve payout
export const approvePayout = async (req, res) => {
  try {
    const payout = await Payout.findById(req.params.payoutId).populate("user");
    if (!payout) return res.status(404).json({ message: "Request not found" });
    if (payout.status !== "pending")
      return res.status(400).json({ message: "Already processed" });

    payout.status = "approved";
    await payout.save();

    const user = payout.user;
    user.walletBalance -= payout.amount;
    await user.save();

    await Transaction.create({
      user: user._id,
      type: "payout",
      amount: payout.amount,
      status: "success",
      remark: "Payout Approved",
    });

    res.json({ message: "Payout approved and wallet debited" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Reject payout
export const rejectPayout = async (req, res) => {
  try {
    const payout = await Payout.findById(req.params.payoutId);
    if (!payout) return res.status(404).json({ message: "Request not found" });
    if (payout.status !== "pending")
      return res.status(400).json({ message: "Already processed" });

    payout.status = "rejected";
    await payout.save();

    res.json({ message: "Payout rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: View all payout requests
// export const getAllPayoutRequests = async (req, res) => {
//   try {
//     const requests = await Payout.find()
//       .populate("user", "username email upiId walletBalance")
//       .sort({ createdAt: -1 });
//     res.status(200).json(requests);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
export const getAllPayoutRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    const totalItems = await Payout.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const payouts = await Payout.find()
      .populate("user", "username email upiId walletBalance")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      payouts,
      page,
      totalPages,
      totalItems,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
