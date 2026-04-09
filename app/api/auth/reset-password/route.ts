import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { validatePassword } from "@/lib/password";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "토큰과 새 비밀번호를 입력해주세요." }, { status: 400 });
    }

    const pwError = validatePassword(password);
    if (pwError) {
      return NextResponse.json({ error: pwError }, { status: 400 });
    }

    // 토큰 삭제와 유저 업데이트를 트랜잭션으로 처리 (토큰 재사용 방지)
    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "링크가 만료되었거나 유효하지 않습니다." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.passwordResetToken.delete({ where: { token } }),
      prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    ]);

    return NextResponse.json({ message: "비밀번호가 변경되었습니다." });
  } catch (error) {
    console.error("[POST /api/auth/reset-password]", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
