import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { checkRateLimit } from "@/lib/rate-limit";

// 15분 내 10회 제한
const LOGIN_RATE_LIMIT = { maxRequests: 10, windowMs: 15 * 60 * 1000 };

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rl = checkRateLimit(`login:${ip}`, LOGIN_RATE_LIMIT);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "email과 password는 필수입니다." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    const cookieStore = await cookies();
    cookieStore.set("root_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    const { passwordHash: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser, token });
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
