import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import { sendNewAssetNotifyAdmin } from "@/lib/email";

// ────────────────────────────────────────────────
// POST /api/assets — 자산 등록
// ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth.ok) return auth.response;

  const { userId, role } = auth.payload;

  try {
    const body = await req.json();

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
      // 장비 이력
      manufacturedYear,
      manufacturedMonth,
      purchasedAt,
      purchasedFrom,
      purchasePrice,
      // 서비스 옵션
      serviceOptions,
    } = body;

    if (!assetTitle || !category || !quantity || !conditionGrade || !locationRegion) {
      return NextResponse.json(
        { error: "assetTitle, category, quantity, conditionGrade, locationRegion은 필수입니다." },
        { status: 400 }
      );
    }

    if (typeof quantity !== "number" || quantity < 1 || quantity > 9999) {
      return NextResponse.json({ error: "수량은 1~9,999 사이여야 합니다." }, { status: 400 });
    }

    if (askingPrice !== undefined && askingPrice !== null && askingPrice > 99_900_000_000) {
      return NextResponse.json({ error: "희망가는 999억 원 이하여야 합니다." }, { status: 400 });
    }

    const asset = await prisma.asset.create({
      data: {
        ownerUserId: userId,
        assetTitle: assetTitle.trim(),
        category: category.trim(),
        subcategory: subcategory?.trim() ?? null,
        manufacturer: manufacturer?.trim() ?? null,
        modelName: modelName?.trim() ?? null,
        quantity,
        unit: unit?.trim() ?? null,
        conditionGrade: conditionGrade.trim(),
        locationRegion: locationRegion.trim(),
        locationDetail: locationDetail?.trim() ?? null,
        askingPrice: askingPrice ?? null,
        priceNegotiable: priceNegotiable ?? false,
        description: description?.trim() ?? null,
        imageUrls: imageUrls ?? [],
        dismantlingRequired: dismantlingRequired ?? false,
        transportRequired: transportRequired ?? false,
        installationRequired: installationRequired ?? false,
        manufacturedYear: manufacturedYear ?? null,
        manufacturedMonth: manufacturedMonth ?? null,
        purchasedAt: purchasedAt ? new Date(purchasedAt) : null,
        purchasedFrom: purchasedFrom?.trim() ?? null,
        purchasePrice: purchasePrice ?? null,
        serviceOptions: Array.isArray(serviceOptions) ? serviceOptions : [],
      },
    });

    // 어드민에게 새 자산 등록 알림 이메일 (비동기, 실패해도 응답 영향 없음)
    const owner = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, companyName: true } });
    const admins = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { email: true } });
    for (const admin of admins) {
      sendNewAssetNotifyAdmin(admin.email, asset.assetTitle, asset.id, owner?.name ?? "", owner?.companyName ?? "").catch(console.error);
    }

    return NextResponse.json({ asset }, { status: 201 });
  } catch (error) {
    console.error("[API /api/assets]", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// ────────────────────────────────────────────────
// GET /api/assets — 자산 목록 조회
// ADMIN: 전체 / USER: 본인 것만
// ────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth.ok) return auth.response;

  const { userId, role } = auth.payload;

  try {
    const assets = await prisma.asset.findMany({
      where: role === "ADMIN" ? {} : { ownerUserId: userId },
      orderBy: { createdAt: "desc" },
    });

    // 구매금액은 본인(소유자) + ADMIN만 노출
    const filtered = assets.map((a) => {
      if (role === "ADMIN" || a.ownerUserId === userId) return a;
      const { purchasePrice: _, ...rest } = a;
      return rest;
    });

    return NextResponse.json({ assets: filtered });
  } catch (error) {
    console.error("[API /api/assets]", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
