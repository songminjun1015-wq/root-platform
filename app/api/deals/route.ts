import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";

// ────────────────────────────────────────────────
// POST /api/deals — Deal 생성 (ADMIN만 가능)
// ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth.ok) return auth.response;

  const { userId, role } = auth.payload;

  if (role !== "ADMIN") {
    return NextResponse.json({ error: "ADMIN만 Deal을 생성할 수 있습니다." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { dealTitle, assetId, requestId, expectedValue, notes } = body;

    if (!dealTitle) {
      return NextResponse.json({ error: "dealTitle은 필수입니다." }, { status: 400 });
    }

    if (!assetId && !requestId) {
      return NextResponse.json(
        { error: "assetId 또는 requestId 중 최소 하나는 필요합니다." },
        { status: 400 }
      );
    }

    // 존재하는 asset/request인지 검증
    if (assetId) {
      const asset = await prisma.asset.findUnique({ where: { id: assetId } });
      if (!asset) {
        return NextResponse.json({ error: "존재하지 않는 assetId입니다." }, { status: 400 });
      }
      if (asset.status !== "ACTIVE") {
        return NextResponse.json({ error: "ACTIVE 상태인 자산만 딜에 연결할 수 있습니다." }, { status: 400 });
      }
    }

    if (requestId) {
      const request = await prisma.request.findUnique({ where: { id: requestId } });
      if (!request) {
        return NextResponse.json({ error: "존재하지 않는 requestId입니다." }, { status: 400 });
      }
    }

    const [deal] = await prisma.$transaction([
      prisma.deal.create({
        data: {
          createdByAdminId: userId,
          dealTitle: dealTitle.trim(),
          assetId: assetId ?? null,
          requestId: requestId ?? null,
          expectedValue: expectedValue ?? null,
          notes: notes?.trim() ?? null,
        },
        include: {
          asset: { select: { id: true, assetTitle: true } },
          request: { select: { id: true, requestTitle: true } },
        },
      }),
      ...(assetId ? [prisma.asset.update({ where: { id: assetId }, data: { status: "MATCHED" } })] : []),
    ]);

    return NextResponse.json({ deal }, { status: 201 });
  } catch (error) {
    console.error("[API /api/deals]", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// ────────────────────────────────────────────────
// GET /api/deals — Deal 목록 조회
// ADMIN: 전체 / USER: 본인 asset 또는 request 연결된 것
// ────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth.ok) return auth.response;

  const { userId, role } = auth.payload;

  try {
    const deals = await prisma.deal.findMany({
      where:
        role === "ADMIN"
          ? {}
          : { OR: [{ asset: { ownerUserId: userId } }, { request: { requesterUserId: userId } }] },
      orderBy: { createdAt: "desc" },
      include: {
        asset: { select: { id: true, assetTitle: true } },
        request: { select: { id: true, requestTitle: true } },
      },
    });

    return NextResponse.json({ deals });
  } catch (error) {
    console.error("[API /api/deals]", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
