import User from "../models/User.js";
import bcrypt from "bcryptjs";
// Manually create an admin user (admin-only access)
export const createAdminUser = async (req, res) => {
  const { username, email, password, valorantName } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Manually set isAdmin to true for admin creation
    const newAdmin = new User({
      username,
      email,
      valorantName,
      password: hashedPassword,
      isAdmin: true, // Only admins should be able to create other admins
    });

    await newAdmin.save();
    res
      .status(201)
      .json({ message: "Admin user created successfully", newAdmin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
