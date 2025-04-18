import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  valorantName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  walletBalance: { type: Number, default: 0 },
  profilePic: { type: String, default: null }, // This field should store the profile picture URL
  upiId: { type: String, default: null }, // UPI ID field
});

export default mongoose.model("User", userSchema);
