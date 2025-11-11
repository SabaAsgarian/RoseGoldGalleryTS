import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";

const router = express.Router();

// --------------------
// Type augmentation for Express Request
// --------------------
interface AuthRequest extends Request {
  userId?: string;
}

// --------------------
// Authentication Middleware
// --------------------
export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decoded = jwt.verify(token, secret) as { id: string };
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

// --------------------
// Get user profile
// --------------------
router.get("/profile", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(400).json({ error: "User ID not found in request" });
    }

    const user: IUser | null = await User.findById(req.userId).select("-pass");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error: any) {
    console.error("Profile fetch error:", error.message);
    res.status(500).json({ error: "Error fetching user profile", details: error.message });
  }
});

export default router;
