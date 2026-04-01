import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import { DealStatus } from "@prisma/client";

// ────────────────────────────────────────────────
// GET /api/deals/[id] — Deal 상세 조회
// ADMIN: 전체 / USER: 본인 asset 또는 request 관련만
// ────────────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuth(req);
  if (!auth.ok) return auth.response;

  const { userId, role } = auth.payload;
  const { id } = await params;

  try {
    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        asset: { select: { id: true, assetTitle: true, ownerUserId: true } },
        request: { select: { id: true, requestTitle: true, requesterUserId: true } },
      },
    });

    if (!deal) {
      return NextResponse.json({ error: "Deal을 찾을 수 없습니다." }, { status: 404 });
    }

    if (role !== "ADMIN") {
      const isMyAsset = deal.asset?.ownerUserId === userId;
      const isMyRequest = deal.request?.requesterUserId === userId;
      if (!isMyAsset && !isMyRequest) {
        return NextResponse.json({ error: "접근 권한이 없습니다." }, { status: 403 });
      }
    }

    return NextResponse.json({ deal });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// ────────────────────────────────────────────────
// PATCH /api/deals/[id] — Deal 수정 (ADMIN만 가능)
// ────────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuth(req);
  if (!auth.ok) return auth.response;

  const { role } = auth.payload;
  const { id } = await params;

  if (role !== "ADMIN") {
    return NextResponse.json({ error: "ADMIN만 Deal을 수정할 수 있습니다." }, { status: 403 });
  }

  try {
    const deal = await prisma.deal.findUnique({ where: { id } });
    if (!deal) {
      return NextResponse.json({ error: "Deal을 찾을 수 없습니다." }, { status: 404 });
    }

    const body = await req.json();
    const { dealTitle, status, expectedValue, finalValue, notes } = body;

    if (status !== undefined && !Object.values(DealStatus).includes(status)) {
      return NextResponse.json(
        { error: "유효하지 않은 status입니다." },
        { status: 400 }
      );
    }

    const updated = await prisma.deal.update({
      where: { id },
      data: {
        ...(dealTitle !== undefined && { dealTitle: dealTitle.trim() }),
        ...(status !== undefined && { status }),
        ...(expectedValue !== undefined && { expectedValue }),
        ...(finalValue !== undefined && { finalValue }),
        ...(notes !== undefined && { notes: notes?.trim() ?? null }),
      },
      include: {
        asset: { select: { id: true, assetTitle: true } },
        request: { select: { id: true, requestTitle: true } },
      },
    });

    return NextResponse.json({ deal: updated });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
