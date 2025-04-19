import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import timeSlotRoutes from "./routes/timeSlotRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import authRoutes from "./routes/authRoutes.js";
import matchResultRoutes from "./routes/matchResultRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import payoutRoutes from "./routes/payoutRoutes.js";
import adminPayoutRoutes from "./routes/adminPayoutRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
dotenv.config();
connectDB();

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("BattleSlots backend is running 🟢");
});

app.use(express.json());
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/timeslots", timeSlotRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/payout", payoutRoutes);
app.use("/api/admin/payout", adminPayoutRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/results", matchResultRoutes);
app.use("/api/payments", paymentRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
