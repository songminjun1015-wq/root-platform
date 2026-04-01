import { NextRequest, NextResponse } from "next/server";
import { verifyToken, JwtPayload } from "@/lib/jwt";

export type AuthResult =
  | { ok: true; payload: JwtPayload }
  | { ok: false; response: NextResponse };

export function getAuth(req: NextRequest): AuthResult {
  // cookie 우선, Authorization 헤더 fallback
  const cookieToken = req.cookies.get("root_token")?.value;
  const authHeader = req.headers.get("authorization");
  const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const token = cookieToken || headerToken;

  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ error: "인증 토큰이 필요합니다." }, { status: 401 }),
    };
  }

  try {
    const payload = verifyToken(token);
    return { ok: true, payload };
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "유효하지 않은 토큰입니다." }, { status: 401 }),
    };
  }
}
