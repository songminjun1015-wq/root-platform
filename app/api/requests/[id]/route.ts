import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import { UrgencyLevel } from "@prisma/client";

// ────────────────────────────────────────────────
// GET /api/requests/[id] — 요청 상세 조회
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
    const request = await prisma.request.findUnique({ where: { id } });

    if (!request) {
      return NextResponse.json({ error: "요청을 찾을 수 없습니다." }, { status: 404 });
    }

    if (role !== "ADMIN" && request.requesterUserId !== userId) {
      return NextResponse.json({ error: "접근 권한이 없습니다." }, { status: 403 });
    }

    return NextResponse.json({ request });
  } catch (error) {
    console.error("[API /api/requests/[id]]", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// ────────────────────────────────────────────────
// PATCH /api/requests/[id] — 요청 수정
// ADMIN: 전체 / USER: 본인 것만 (status 변경 불가)
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
    const request = await prisma.request.findUnique({ where: { id } });

    if (!request) {
      return NextResponse.json({ error: "요청을 찾을 수 없습니다." }, { status: 404 });
    }

    if (role !== "ADMIN" && request.requesterUserId !== userId) {
      return NextResponse.json({ error: "접근 권한이 없습니다." }, { status: 403 });
    }

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
      contactPhone,
      status,
    } = body;

    if (desiredQuantity !== undefined && (typeof desiredQuantity !== "number" || desiredQuantity < 1)) {
      return NextResponse.json({ error: "desiredQuantity는 1 이상의 숫자여야 합니다." }, { status: 400 });
    }

    if (urgencyLevel !== undefined && !Object.values(UrgencyLevel).includes(urgencyLevel)) {
      return NextResponse.json(
        { error: "urgencyLevel은 LOW / MEDIUM / HIGH / URGENT 중 하나여야 합니다." },
        { status: 400 }
      );
    }

    if (role !== "ADMIN" && status !== undefined) {
      return NextResponse.json({ error: "status는 운영자만 변경할 수 있습니다." }, { status: 403 });
    }

    const updated = await prisma.request.update({
      where: { id },
      data: {
        ...(requestTitle !== undefined && { requestTitle: requestTitle.trim() }),
        ...(category !== undefined && { category: category.trim() }),
        ...(subcategory !== undefined && { subcategory: subcategory?.trim() ?? null }),
        ...(desiredQuantity !== undefined && { desiredQuantity }),
        ...(budgetMin !== undefined && { budgetMin }),
        ...(budgetMax !== undefined && { budgetMax }),
        ...(preferredRegion !== undefined && { preferredRegion: preferredRegion.trim() }),
        ...(neededByDate !== undefined && { neededByDate: neededByDate ? new Date(neededByDate) : null }),
        ...(urgencyLevel !== undefined && { urgencyLevel }),
        ...(transportRequired !== undefined && { transportRequired }),
        ...(installationRequired !== undefined && { installationRequired }),
        ...(description !== undefined && { description: description?.trim() ?? null }),
        ...(contactPhone !== undefined && { contactPhone: contactPhone?.trim() ?? null }),
        ...(status !== undefined && role === "ADMIN" && { status }),
      },
    });

    return NextResponse.json({ request: updated });
  } catch (error) {
    console.error("[API /api/requests/[id]]", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
