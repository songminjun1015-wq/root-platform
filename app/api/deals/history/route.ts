import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";

// ────────────────────────────────────────────────
// POST /api/deals/history — 과거 거래 수기 입력 (ADMIN만 가능)
// Asset 생성(SOLD) + Deal 생성(WON, isHistorical) 트랜잭션
// ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth.ok) return auth.response;

  const { userId, role } = auth.payload;

  if (role !== "ADMIN") {
    return NextResponse.json({ error: "ADMIN만 접근할 수 있습니다." }, { status: 403 });
  }

  try {
    const body = await req.json();

    const {
      // 딜 정보
      dealTitle,
      finalValue,
      closedAt,
      sellerName,
      sellerCompany,
      buyerName,
      buyerCompany,
      notes,
      // 자산 정보
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
      description,
      manufacturedYear,
      manufacturedMonth,
      purchasedAt,
      purchasedFrom,
      purchasePrice,
      serviceOptions,
    } = body;

    if (!dealTitle?.trim()) {
      return NextResponse.json({ error: "딜명은 필수입니다." }, { status: 400 });
    }
    if (!assetTitle?.trim()) {
      return NextResponse.json({ error: "자산명은 필수입니다." }, { status: 400 });
    }
    if (!category?.trim()) {
      return NextResponse.json({ error: "카테고리는 필수입니다." }, { status: 400 });
    }
    if (!conditionGrade?.trim()) {
      return NextResponse.json({ error: "상태등급은 필수입니다." }, { status: 400 });
    }
    if (!locationRegion?.trim()) {
      return NextResponse.json({ error: "지역은 필수입니다." }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const asset = await tx.asset.create({
        data: {
          ownerUserId: userId,
          assetTitle: assetTitle.trim(),
          category: category.trim(),
          subcategory: subcategory?.trim() || null,
          manufacturer: manufacturer?.trim() || null,
          modelName: modelName?.trim() || null,
          quantity: Number(quantity) || 1,
          unit: unit?.trim() || null,
          conditionGrade: conditionGrade.trim(),
          locationRegion: locationRegion.trim(),
          locationDetail: locationDetail?.trim() || null,
          askingPrice: askingPrice ? Number(askingPrice) : null,
          description: description?.trim() || null,
          imageUrls: [],
          manufacturedYear: manufacturedYear ? Number(manufacturedYear) : null,
          manufacturedMonth: manufacturedMonth ? Number(manufacturedMonth) : null,
          purchasedAt: purchasedAt ? new Date(purchasedAt) : null,
          purchasedFrom: purchasedFrom?.trim() || null,
          purchasePrice: purchasePrice ? Number(purchasePrice) : null,
          serviceOptions: Array.isArray(serviceOptions) ? serviceOptions : [],
          status: "SOLD",
        },
      });

      const deal = await tx.deal.create({
        data: {
          createdByAdminId: userId,
          assetId: asset.id,
          dealTitle: dealTitle.trim(),
          status: "WON",
          finalValue: finalValue ? Number(finalValue) : null,
          notes: notes?.trim() || null,
          isHistorical: true,
          closedAt: closedAt ? new Date(closedAt) : null,
          sellerName: sellerName?.trim() || null,
          sellerCompany: sellerCompany?.trim() || null,
          buyerName: buyerName?.trim() || null,
          buyerCompany: buyerCompany?.trim() || null,
        },
      });

      return { asset, deal };
    });

    return NextResponse.json({ deal: result.deal }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/deals/history]", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
