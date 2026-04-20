import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import crypto from "crypto";

// 15분 내 5회 제한
const FORGOT_PW_RATE_LIMIT = { maxRequests: 5, windowMs: 15 * 60 * 1000 };

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rl = checkRateLimit(`forgot-pw:${ip}`, FORGOT_PW_RATE_LIMIT);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "이메일을 입력해주세요." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // 유저가 없어도 동일한 응답 (이메일 존재 여부 노출 방지)
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1시간

      // 기존 토큰 삭제 + 새 토큰 생성 원자적 처리
      await prisma.$transaction([
        prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
        prisma.passwordResetToken.create({ data: { userId: user.id, token, expiresAt } }),
      ]);

      await sendPasswordResetEmail(email, token);
    }

    return NextResponse.json({ message: "이메일을 확인해주세요." });
  } catch (error) {
    console.error("[POST /api/auth/forgot-password]", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
