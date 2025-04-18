import User from "../models/User.js";

// Get user profile details
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Endpoint for fetching current user's profile
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user); // Return user data (without password)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// In controllers/userController.js
export const updateUserUpiId = async (req, res) => {
  try {
    const { upiId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.upiId = upiId;
    await user.save();

    res.status(200).json({ message: "UPI ID updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUpiId = async (req, res) => {
  try {
    const { upiId } = req.body;
    const user = await User.findById(req.user.id); // Find the logged-in user

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.upiId = upiId; // Save the new UPI ID
    await user.save(); // Save the changes to the user

    res.status(200).json({ message: "UPI ID updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user profile
// In controllers/userController.js

// Update user profile

export const updateUserProfile = async (req, res) => {
  try {
    const { username, valorantName, email, upiId, profilePic } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (username) user.username = username;
    if (valorantName) user.valorantName = valorantName;
    if (email) user.email = email;
    if (upiId) user.upiId = upiId;
    if (profilePic) user.profilePic = profilePic; // This is where the profile picture is updated

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};
