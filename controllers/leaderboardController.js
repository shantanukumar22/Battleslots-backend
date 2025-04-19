import User from "../models/User.js";

// @desc    Get leaderboard sorted by totalPrizes
// @route   GET /api/leaderboard
// @access  Public
export const getLeaderboard = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
    const totalPlayers = await User.countDocuments({ totalPrizes: { $gt: 0 } });
    const totalPages = Math.ceil(totalPlayers / limit);

    const players = await User.find({ totalPrizes: { $gt: 0 } })
      .sort({ totalPrizes: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("username valorantName totalPrizes");

    res.json({
      players,
      page,
      totalPages,
      totalPlayers,
    });
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};
