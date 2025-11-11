import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// ✅ Define the shape of the decoded JWT payload
interface DecodedToken extends JwtPayload {
  userId: string;
  role: "admin" | "moderator" | "user";
}

// ✅ Extend Express Request type to include custom fields
declare module "express-serve-static-core" {
  interface Request {
    userData?: {
      userId: string;
      role: string;
    };
  }
}

// ✅ Authentication Middleware
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      res.status(401).json({ message: "Authentication failed!" });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decoded = jwt.verify(token, secret) as DecodedToken;

    req.userData = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Authentication failed!" });
  }
};

// ✅ Admin-only Middleware
export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (req.userData?.role !== "admin") {
    res.status(403).json({ message: "Admin access required!" });
    return;
  }
  next();
};

// ✅ Moderator-only Middleware
export const moderatorMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (req.userData?.role !== "moderator") {
    res.status(403).json({ error: "Access denied" });
    return;
  }
  next();
};

// ✅ Regular User-only Middleware
export const userMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (req.userData?.role !== "user") {
    res.status(403).json({ error: "Access denied" });
    return;
  }
  next();
};

export default authMiddleware;
