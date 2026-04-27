import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";

// PATCH /api/users/[id] — 역할 변경 (ADMIN만)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuth(req);
  if (!auth.ok) return auth.response;
  if (auth.payload.role !== "ADMIN") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { id } = await params;

  try {
    const { role } = await req.json();
    if (!["ADMIN", "USER"].includes(role)) {
      return NextResponse.json({ error: "유효하지 않은 역할입니다." }, { status: 400 });
    }

    // 본인 역할은 변경 불가
    if (id === auth.payload.userId) {
      return NextResponse.json({ error: "본인의 역할은 변경할 수 없습니다." }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[PATCH /api/users/[id]]", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// DELETE /api/users/[id] — 회원 삭제 (ADMIN만)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuth(req);
  if (!auth.ok) return auth.response;
  if (auth.payload.role !== "ADMIN") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { id } = await params;

  if (id === auth.payload.userId) {
    return NextResponse.json({ error: "본인 계정은 삭제할 수 없습니다." }, { status: 400 });
  }

  try {
    const target = await prisma.user.findUnique({
      where: { id },
      select: { id: true, _count: { select: { dealsCreated: true } } },
    });

    if (!target) {
      return NextResponse.json({ error: "존재하지 않는 회원입니다." }, { status: 404 });
    }

    // 운영자가 만든 거래(Deal)가 있으면 데이터 무결성 보호를 위해 차단
    if (target._count.dealsCreated > 0) {
      return NextResponse.json(
        {
          error:
            "이 회원이 생성한 거래가 있어 삭제할 수 없습니다. 먼저 거래를 정리하거나 다른 운영자에게 이관해 주세요.",
        },
        { status: 409 }
      );
    }

    // 자산/요청은 Deal에서 SetNull, 비밀번호 토큰은 Cascade로 자동 정리됨
    await prisma.$transaction([
      prisma.asset.deleteMany({ where: { ownerUserId: id } }),
      prisma.request.deleteMany({ where: { requesterUserId: id } }),
      prisma.user.delete({ where: { id } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/users/[id]]", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
