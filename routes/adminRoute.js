import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js"; // Ensure admin is authenticated
import { createAdminUser } from "../controllers/adminController.js"; // Controller to create admin

const router = express.Router();

// Admin route to create an admin user (only accessible by authenticated admins)
router.post("/create-admin", protect,  createAdminUser);

export default router;
