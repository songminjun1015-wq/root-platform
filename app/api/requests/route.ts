import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import { UrgencyLevel } from "@prisma/client";

// ────────────────────────────────────────────────
// POST /api/requests — 구매 요청 등록
// ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth.ok) return auth.response;

  const { userId, role } = auth.payload;

  try {
    const body = await req.json();

    const {
      requestTitle,
      category,
      subcategory,
      desiredQuantity,
      budgetMin,
      budgetMax,
      preferredRegion,
      neededByDate,
      urgencyLevel,
      transportRequired,
      installationRequired,
      description,
    } = body;

    if (!requestTitle || !category || !desiredQuantity || !preferredRegion) {
      return NextResponse.json(
        { error: "requestTitle, category, desiredQuantity, preferredRegion은 필수입니다." },
        { status: 400 }
      );
    }

    if (typeof desiredQuantity !== "number" || desiredQuantity < 1) {
      return NextResponse.json({ error: "desiredQuantity는 1 이상의 숫자여야 합니다." }, { status: 400 });
    }

    if (urgencyLevel && !Object.values(UrgencyLevel).includes(urgencyLevel)) {
      return NextResponse.json(
        { error: "urgencyLevel은 LOW / MEDIUM / HIGH / URGENT 중 하나여야 합니다." },
        { status: 400 }
      );
    }

    const request = await prisma.request.create({
      data: {
        requesterUserId: userId,
        requestTitle: requestTitle.trim(),
        category: category.trim(),
        subcategory: subcategory?.trim() ?? null,
        desiredQuantity,
        budgetMin: budgetMin ?? null,
        budgetMax: budgetMax ?? null,
        preferredRegion: preferredRegion.trim(),
        neededByDate: neededByDate ? new Date(neededByDate) : null,
        urgencyLevel: urgencyLevel ?? UrgencyLevel.MEDIUM,
        transportRequired: transportRequired ?? false,
        installationRequired: installationRequired ?? false,
        description: description?.trim() ?? null,
      },
    });

    return NextResponse.json({ request }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// ────────────────────────────────────────────────
// GET /api/requests — 요청 목록 조회
// ADMIN: 전체 / USER: 본인 것만
// ────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth.ok) return auth.response;

  const { userId, role } = auth.payload;

  try {
    const requests = await prisma.request.findMany({
      where: role === "ADMIN" ? {} : { requesterUserId: userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ requests });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
