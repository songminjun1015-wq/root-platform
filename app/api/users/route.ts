import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";

// GET /api/users — 전체 유저 목록 (ADMIN만)
export async function GET(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth.ok) return auth.response;
  if (auth.payload.role !== "ADMIN") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        companyName: true,
        role: true,
        createdAt: true,
        _count: { select: { assets: true, requests: true } },
      },
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error("[GET /api/users]", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
