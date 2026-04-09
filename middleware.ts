import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PAGES = ["/", "/login", "/register", "/forgot-password", "/reset-password"];

const AUTH_PAGES = ["/login", "/register", "/forgot-password", "/reset-password"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // API 라우트는 자체 인증 처리
  if (pathname.startsWith("/api/")) return NextResponse.next();

  // 정적 파일 허용 (이미지 등)
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return NextResponse.next();

  const token = req.cookies.get("root_token")?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      await jwtVerify(token, secret);
      isAuthenticated = true;
    } catch {}
  }

  // 로그인된 사용자가 인증 페이지 접근 시 대시보드로 리다이렉트
  if (isAuthenticated && AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 공개 페이지 허용
  if (PUBLIC_PAGES.includes(pathname)) return NextResponse.next();

  // 비로그인 사용자는 로그인 페이지로
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.webp).*)"],
};
