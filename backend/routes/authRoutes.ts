import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";
import { Admin, IAdmin } from "../models/Admin"; // Make sure your Admin model is TS

const router = express.Router();

// Extend Express Request to include `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string; role: string };
  }
}

// --------------------
// 📌 User Registration
// --------------------
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { fname, lname, email, mobile, pass, img, city, street, age } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists!" });
    }

    const hashedPass = await bcrypt.hash(pass, 12);
    const newUser = new User({
      fname,
      lname,
      email,
      mobile,
      pass: hashedPass,
      img,
      city,
      street,
      age,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error: any) {
    console.error("User registration error:", error.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

// --------------------
// 📌 User Login
// --------------------
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, mobile, pass } = req.body;
    const identifier = email || mobile;

    const user: IUser | null = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });

    if (!user) return res.status(404).json({ error: "User not found!" });

    const isMatch = await bcrypt.compare(pass, user.pass as string);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");

    const token = jwt.sign({ id: user._id.toString(), role: user.role }, secret, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        age: user.age,
        city: user.city,
        street: user.street,
        img: user.img,
      },
    });
  } catch (error: any) {
    console.error("User login error:", error.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// --------------------
// 📌 Admin Registration
// --------------------
router.post("/admin/register", async (req: Request, res: Response) => {
  try {
    const { fname, lname, email, pass } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ error: "Admin already exists!" });

    const hashedPass = await bcrypt.hash(pass, 8);
    const newAdmin = new Admin({ fname, lname, email, pass: hashedPass });

    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully!" });
  } catch (error: any) {
    console.error("Admin registration error:", error.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

// --------------------
// 📌 Admin Login
// --------------------
router.post("/admin/login", async (req: Request, res: Response) => {
  try {
    const { email, pass } = req.body;
    const admin: IAdmin | null = await Admin.findOne({ email });

    if (!admin) return res.status(404).json({ error: "Admin not found!" });

    const isMatch = await bcrypt.compare(pass, admin.pass as string);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");

    const token = jwt.sign({ id: admin._id.toString(), role: admin.role }, secret, {
      expiresIn: "1h",
    });

    res.json({
      token,
      admin: {
        id: admin._id,
        fname: admin.fname,
        lname: admin.lname,
        email: admin.email,
      },
    });
  } catch (error: any) {
    console.error("Admin login error:", error.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// --------------------
// 📌 Get single user by ID
// --------------------
router.get("/user/:id", async (req: Request, res: Response) => {
  try {
    const user: IUser | null = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found!" });

    res.json({
      id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      age: user.age,
      city: user.city,
      street: user.street,
      img: user.img,
    });
  } catch (error: any) {
    console.error("Fetch user error:", error.message);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
});

// --------------------
// 📌 Get all users
// --------------------
router.get("/user", async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error: any) {
    console.error("Fetch users error:", error.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// --------------------
// 📌 Delete user
// --------------------
router.delete("/user/:id", async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Delete user error:", error.message);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// --------------------
// 📌 Update user
// --------------------
router.put("/user/:id", async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error("Update user error:", error.message);
    res.status(500).json({ error: "Failed to update user" });
  }
});

export default router;
