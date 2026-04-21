import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = "1d";

if (!SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET is required in production");
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export function signToken(payload: JwtPayload): string {
  if (!SECRET) throw new Error("JWT_SECRET is not configured");
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  if (!SECRET) throw new Error("JWT_SECRET is not configured");
  return jwt.verify(token, SECRET) as JwtPayload;
}
