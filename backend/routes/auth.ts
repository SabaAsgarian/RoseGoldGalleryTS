import express, { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User, IUser } from "../models/User"; // Make sure your user model is TypeScript

const router = express.Router();

// Extend Express Request to include user for middleware
declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string; role: string };
  }
}

// 🟢 Login endpoint (Admin/User)
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, pass } = req.body;

  if (!email || !pass) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    // Find user by email
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "❌ Wrong email or password" });
      return;
    }

    // Compare passwords
    const isMatch = await user.comparePassword(pass); // We'll add comparePassword in User model
    if (!isMatch) {
      res.status(401).json({ message: "❌ Wrong email or password" });
      return;
    }

    // Generate JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      secret,
      { expiresIn: "1h" }
    );

    res.json({
      message: "✅ Login successful",
      token,
      user: {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "❌ Server error" });
  }
});

// 🔐 Authentication middleware
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      res.status(401).json({ message: "❌ احراز هویت ناموفق!" });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");

    const decoded = jwt.verify(token, secret) as JwtPayload & { userId: string; role: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ message: "❌ کاربر یافت نشد!" });
      return;
    }

    req.user = { id: user._id.toString(), role: user.role ?? "user" };
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "❌ احراز هویت ناموفق!" });
  }
};

export default router;
