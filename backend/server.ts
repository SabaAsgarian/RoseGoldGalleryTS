import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import multer from "multer";

import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { User } from "./models/User.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Extend Express Request interface to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}

// ✅ CORS whitelist
const whitelist = [
  "http://localhost:3000",
  "https://rosegoldgalleryy.vercel.app",
  "https://rose-gold-gallery.vercel.app",
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`🚫 Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/user", userRoutes);

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Only images allowed"));
    cb(null, true);
  },
});

// JWT Authentication Middleware
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & { id: string; role: string };
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// Test routes
app.get("/", (_req: Request, res: Response) => {
  res.send("🚀 Server is running...");
});

app.get("/api/admin", authMiddleware, (req: Request, res: Response) => {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Admin access required" });
  res.json({ message: "Welcome Admin Dashboard" });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
