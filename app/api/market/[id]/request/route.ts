import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import { sendMatchingRequestEmail } from "@/lib/email";

// POST /api/market/[id]/request — 매칭 요청 (로그인 필요)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuth(req);
  if (!auth.ok) return auth.response;

  const { userId } = auth.payload;
  const { id } = await params;

  try {
    const [asset, requester, admins] = await Promise.all([
      prisma.asset.findUnique({ where: { id, status: "ACTIVE" }, select: { id: true, assetTitle: true } }),
      prisma.user.findUnique({ where: { id: userId }, select: { name: true, companyName: true, email: true } }),
      prisma.user.findMany({ where: { role: "ADMIN" }, select: { email: true } }),
    ]);

    if (!asset) {
      return NextResponse.json({ error: "자산을 찾을 수 없습니다." }, { status: 404 });
    }

    if (!requester) {
      return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });
    }

    for (const admin of admins) {
      sendMatchingRequestEmail(
        admin.email,
        asset.assetTitle,
        asset.id,
        requester.name,
        requester.companyName,
        requester.email
      ).catch(console.error);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[POST /api/market/[id]/request]", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
