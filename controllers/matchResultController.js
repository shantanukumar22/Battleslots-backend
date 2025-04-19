import MatchResult from "../models/MatchResult.js";
import TimeSlot from "../models/TimeSlot.js";
import User from "../models/User.js";
import { createTransaction } from "./transactionController.js";

/// Admin: Submit match result
// export const submitMatchResult = async (req, res) => {
//   try {
//     const { timeSlotId, results } = req.body;

//     // Fetch the slot
//     const slot = await TimeSlot.findById(timeSlotId);
//     if (!slot) return res.status(404).json({ message: "Time slot not found" });

//     // console.log("Slot before result declaration: ", slot); // Log slot before change

//     // Create match result entry
//     const newResult = new MatchResult({
//       timeSlot: timeSlotId,
//       results,
//       status: "completed",
//     });

//     await newResult.save();

//     // Prize Distribution: Add to wallet and transaction log
//     for (const result of results) {
//       if (result.prize > 0) {
//         const user = await User.findById(result.user);
//         user.walletBalance += result.prize;
//         await user.save();

//         await createTransaction(
//           user._id,
//           "prize",
//           result.prize,
//           "success",
//           `Prize for position ${result.position}`
//         );
//       }
//     }

//     // Update isResultDeclared here:
//     slot.isResultDeclared = true;
//     await slot.save(); // Save the updated slot

//     // console.log("Slot after result declaration: ", slot); // Log slot after change

//     res.status(200).json({
//       message: "Match result submitted and prizes distributed",
//       newResult,
//     });
//   } catch (err) {
//     console.error("Error during result declaration: ", err); // Log any error
//     res.status(500).json({ message: err.message });
//   }
// };

export const submitMatchResult = async (req, res) => {
  try {
    const { timeSlotId, results } = req.body;

    const slot = await TimeSlot.findById(timeSlotId);
    if (!slot) return res.status(404).json({ message: "Time slot not found" });

    const newResult = new MatchResult({
      timeSlot: timeSlotId,
      results,
      status: "completed",
    });

    await newResult.save();

    // Distribute prizes and update leaderboard points
    for (const result of results) {
      if (result.prize > 0) {
        const user = await User.findById(result.user);
        user.walletBalance += result.prize;
        user.totalPrizes += result.prize; // 👈 leaderboard tracking
        await user.save();

        await createTransaction(
          user._id,
          "prize",
          result.prize,
          "success",
          `Prize for position ${result.position}`
        );
      }
    }

    slot.isResultDeclared = true;
    await slot.save();

    res.status(200).json({
      message: "Match result submitted and prizes distributed",
      newResult,
    });
  } catch (err) {
    console.error("Error during result declaration: ", err);
    res.status(500).json({ message: err.message });
  }
};
// Admin: View all match results
export const getAllMatchResults = async (req, res) => {
  try {
    const results = await MatchResult.find()
      .populate("timeSlot")
      .populate("results.user", "username email");
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User: View own match results
export const getUserMatchResults = async (req, res) => {
  try {
    const results = await MatchResult.find({
      "results.user": req.user.id,
    }).populate("timeSlot");
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
