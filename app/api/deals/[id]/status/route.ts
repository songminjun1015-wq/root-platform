import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import { DealStatus } from "@prisma/client";

// 딜 상태 → 자산 상태 매핑
const DEAL_TO_ASSET_STATUS: Partial<Record<DealStatus, string>> = {
  WON:  "SOLD",
  LOST: "ACTIVE", // 거래 불성사 시 자산 다시 활성화
};

// ────────────────────────────────────────────────
// POST /api/deals/[id]/status — Deal 상태 변경 (ADMIN만 가능)
// ────────────────────────────────────────────────
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuth(req);
  if (!auth.ok) return auth.response;

  const { role } = auth.payload;
  const { id } = await params;

  if (role !== "ADMIN") {
    return NextResponse.json({ error: "ADMIN만 Deal 상태를 변경할 수 있습니다." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { status, notes } = body;

    if (!status) {
      return NextResponse.json({ error: "status는 필수입니다." }, { status: 400 });
    }

    if (!Object.values(DealStatus).includes(status)) {
      return NextResponse.json(
        { error: `status는 ${Object.values(DealStatus).join(" / ")} 중 하나여야 합니다.` },
        { status: 400 }
      );
    }

    const deal = await prisma.deal.findUnique({ where: { id } });
    if (!deal) {
      return NextResponse.json({ error: "Deal을 찾을 수 없습니다." }, { status: 404 });
    }

    const newAssetStatus = DEAL_TO_ASSET_STATUS[status as DealStatus];

    const [updated] = await prisma.$transaction([
      prisma.deal.update({
        where: { id },
        data: {
          status,
          ...(notes !== undefined && { notes: notes?.trim() ?? null }),
          ...(status === "WON" && { closedAt: new Date() }),
        },
      }),
      ...(deal.assetId && newAssetStatus
        ? [prisma.asset.update({ where: { id: deal.assetId }, data: { status: newAssetStatus } })]
        : []),
    ]);

    return NextResponse.json({ deal: updated });
  } catch (error) {
    console.error("[POST /api/deals/[id]/status]", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
