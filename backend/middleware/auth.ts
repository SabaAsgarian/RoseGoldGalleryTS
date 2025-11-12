import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Align Request.user shape with the rest of the app
declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string; role: string };
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      res.status(401).json({ error: "لطفا وارد شوید" });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err);
        res.status(403).json({ error: "توکن نامعتبر است" });
        return;
      }

      const payload = decoded as JwtPayload & { id?: string; userId?: string; role?: string };
      req.user = {
        id: String(payload.id ?? payload.userId ?? ""),
        role: payload.role ?? ""
      };
      next();
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "خطا در احراز هویت" });
  }
};
