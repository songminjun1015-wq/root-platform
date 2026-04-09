import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import { sendAssetApprovedEmail } from "@/lib/email";

// ────────────────────────────────────────────────
// GET /api/assets/[id] — 자산 상세 조회
// ADMIN: 전체 / USER: 본인 것만
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
    const asset = await prisma.asset.findUnique({ where: { id } });

    if (!asset) {
      return NextResponse.json({ error: "자산을 찾을 수 없습니다." }, { status: 404 });
    }

    if (role !== "ADMIN" && asset.ownerUserId !== userId) {
      return NextResponse.json({ error: "접근 권한이 없습니다." }, { status: 403 });
    }

    return NextResponse.json({ asset });
  } catch (error) {
    console.error("[API /api/assets/[id]]", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// ────────────────────────────────────────────────
// PATCH /api/assets/[id] — 자산 수정
// ADMIN: 전체 / USER: 본인 것만
// ────────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuth(req);
  if (!auth.ok) return auth.response;

  const { userId, role } = auth.payload;
  const { id } = await params;

  try {
    const asset = await prisma.asset.findUnique({ where: { id } });

    if (!asset) {
      return NextResponse.json({ error: "자산을 찾을 수 없습니다." }, { status: 404 });
    }

    if (role !== "ADMIN" && asset.ownerUserId !== userId) {
      return NextResponse.json({ error: "접근 권한이 없습니다." }, { status: 403 });
    }

    const body = await req.json();

    // ownerUserId, createdAt 등 변경 불가 필드 제외
    const {
      assetTitle,
      category,
      subcategory,
      manufacturer,
      modelName,
      quantity,
      unit,
      conditionGrade,
      locationRegion,
      locationDetail,
      askingPrice,
      priceNegotiable,
      description,
      imageUrls,
      dismantlingRequired,
      transportRequired,
      installationRequired,
      manufacturedYear,
      manufacturedMonth,
      purchasedAt,
      purchasedFrom,
      purchasePrice,
      serviceOptions,
      status,
    } = body;

    if (quantity !== undefined && (typeof quantity !== "number" || quantity < 1 || quantity > 9999)) {
      return NextResponse.json({ error: "수량은 1~9,999 사이여야 합니다." }, { status: 400 });
    }

    if (askingPrice !== undefined && askingPrice !== null && askingPrice > 99_900_000_000) {
      return NextResponse.json({ error: "희망가는 999억 원 이하여야 합니다." }, { status: 400 });
    }

    // USER는 status 직접 변경 불가 (운영자만 변경)
    if (role !== "ADMIN" && status !== undefined) {
      return NextResponse.json({ error: "status는 운영자만 변경할 수 있습니다." }, { status: 403 });
    }

    const updated = await prisma.asset.update({
      where: { id },
      data: {
        ...(assetTitle !== undefined && { assetTitle: assetTitle.trim() }),
        ...(category !== undefined && { category: category.trim() }),
        ...(subcategory !== undefined && { subcategory: subcategory?.trim() ?? null }),
        ...(manufacturer !== undefined && { manufacturer: manufacturer?.trim() ?? null }),
        ...(modelName !== undefined && { modelName: modelName?.trim() ?? null }),
        ...(quantity !== undefined && { quantity }),
        ...(unit !== undefined && { unit: unit?.trim() ?? null }),
        ...(conditionGrade !== undefined && { conditionGrade: conditionGrade.trim() }),
        ...(locationRegion !== undefined && { locationRegion: locationRegion.trim() }),
        ...(locationDetail !== undefined && { locationDetail: locationDetail?.trim() ?? null }),
        ...(askingPrice !== undefined && { askingPrice }),
        ...(priceNegotiable !== undefined && { priceNegotiable }),
        ...(description !== undefined && { description: description?.trim() ?? null }),
        ...(imageUrls !== undefined && { imageUrls }),
        ...(dismantlingRequired !== undefined && { dismantlingRequired }),
        ...(transportRequired !== undefined && { transportRequired }),
        ...(installationRequired !== undefined && { installationRequired }),
        ...(manufacturedYear !== undefined && { manufacturedYear: manufacturedYear ?? null }),
        ...(manufacturedMonth !== undefined && { manufacturedMonth: manufacturedMonth ?? null }),
        ...(purchasedAt !== undefined && { purchasedAt: purchasedAt ? new Date(purchasedAt) : null }),
        ...(purchasedFrom !== undefined && { purchasedFrom: purchasedFrom?.trim() ?? null }),
        ...(purchasePrice !== undefined && { purchasePrice: purchasePrice ?? null }),
        ...(serviceOptions !== undefined && { serviceOptions: Array.isArray(serviceOptions) ? serviceOptions : [] }),
        ...(status !== undefined && role === "ADMIN" && { status }),
      },
    });

    // 자산 상태가 ACTIVE로 승인되면 소유자에게 알림
    if (status === "ACTIVE" && asset.status !== "ACTIVE") {
      const owner = await prisma.user.findUnique({ where: { id: asset.ownerUserId }, select: { email: true } });
      if (owner?.email) {
        sendAssetApprovedEmail(owner.email, updated.assetTitle, updated.id).catch(console.error);
      }
    }

    return NextResponse.json({ asset: updated });
  } catch (error) {
    console.error("[API /api/assets/[id]]", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
