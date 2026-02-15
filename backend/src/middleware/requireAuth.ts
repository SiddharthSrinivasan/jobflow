import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

type JwtPayload = {
  userId: string;
};

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token: string | unknown = authHeader.split(" ")[1];

  try {
    if (token === undefined || typeof token !== "string") {
      return res.status(401).json({ error: "Invalid token format" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("userId" in decoded) ||
      typeof (decoded as any).userId !== "string"
    ) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.userId = (decoded as JwtPayload).userId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

