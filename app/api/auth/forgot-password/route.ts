import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
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
