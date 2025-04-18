import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { username, valorantName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      valorantName,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    res.status(201).json({ message: "Registered Successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    // 👇 Add isAdmin inside the token payload here
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        valorantName: user.valorantName,
        email: user.email,
        isAdmin: user.isAdmin,
        walletBalance: user.walletBalance,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
