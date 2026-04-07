import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PAGES = ["/", "/login", "/register", "/forgot-password", "/reset-password"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // API 라우트는 자체 인증 처리
  if (pathname.startsWith("/api/")) return NextResponse.next();

  // 정적 파일 허용 (이미지 등)
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return NextResponse.next();

  // 공개 페이지 허용
  if (PUBLIC_PAGES.includes(pathname)) return NextResponse.next();

  // 인증 확인
  const token = req.cookies.get("root_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.webp).*)"],
};
