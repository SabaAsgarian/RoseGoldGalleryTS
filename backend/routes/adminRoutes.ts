import express, { Request, Response } from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ Admin login endpoint
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, pass } = req.body;

    if (!email || !pass) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "User not found!" });
      return;
    }

    if (user.role !== "admin") {
      res.status(403).json({ error: "Access denied. Admin privileges required." });
      return;
    }

    const isMatch = await bcrypt.compare(pass, user.pass as string);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(
      { userId: String(user._id), role: user.role },
      secret,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      admin: {
        id: String(user._id),
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// ✅ Admin-only route (Dashboard)
router.get(
  "/admin-dashboard",
  authMiddleware,
  adminMiddleware,
  (req: Request, res: Response): void => {
    res.json({ message: "Welcome to Admin Dashboard" });
  }
);

export default router;