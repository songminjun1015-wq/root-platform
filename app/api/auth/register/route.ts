import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { UserRole } from "@prisma/client";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  companyName: string;
  role: UserRole;
}

const ALLOWED_ROLES: UserRole[] = [UserRole.USER];
const MIN_PASSWORD_LENGTH = 8;

export async function POST(req: NextRequest) {
  try {
    const body: RegisterBody = await req.json();
    const { name, email, password, companyName, role } = body;

    if (!name || !email || !password || !companyName || !role) {
      return NextResponse.json(
        { error: "이름, 이메일, 비밀번호, 회사명은 필수입니다." },
        { status: 400 }
      );
    }

    const normalizedName = name.trim();
    const normalizedCompanyName = companyName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      return NextResponse.json(
        { error: "이름을 입력해주세요." },
        { status: 400 }
      );
    }

    if (normalizedName.length < 2) {
      return NextResponse.json(
        { error: "이름은 최소 2자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    if (!normalizedCompanyName) {
      return NextResponse.json(
        { error: "회사명을 입력해주세요." },
        { status: 400 }
      );
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json(
        { error: "허용되지 않는 역할입니다." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ error: "올바른 이메일 형식이 아닙니다." }, { status: 400 });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `비밀번호는 최소 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.` },
        { status: 400 }
      );
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=\S+$).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: "비밀번호는 영문과 숫자를 포함해야 합니다." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json(
        { error: "이미 사용 중인 이메일입니다." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        passwordHash,
        companyName: normalizedCompanyName,
        role,
      },
      select: { id: true, name: true, email: true, companyName: true, role: true, createdAt: true },
    });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    return NextResponse.json({ user, token }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
