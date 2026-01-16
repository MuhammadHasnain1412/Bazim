import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET environment variable is required. Please set it in your .env file."
  );
}

// Type assertion after validation
const jwtSecret: string = JWT_SECRET;

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded
    ) {
      return decoded as { userId: string };
    }
    return null;
  } catch {
    return null;
  }
}

export function getUserFromRequest(
  request: NextRequest
): { userId: string } | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  return verifyToken(token);
}
