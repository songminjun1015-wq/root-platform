"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { JwtPayload } from "@/lib/jwt";

const ADMIN_NAV = [
  { href: "/dashboard", label: "대시보드", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/assets", label: "자산 관리", icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" },
  { href: "/requests", label: "구매 요청", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { href: "/deals", label: "딜 관리", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { href: "/users", label: "가입 현황", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { href: "/market", label: "매물 현황", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
];

const USER_NAV = [
  { href: "/dashboard", label: "대시보드", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/assets", label: "내 자산", icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" },
  { href: "/requests", label: "구매 요청", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { href: "/deals", label: "진행 중인 딜", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { href: "/market", label: "매물 현황", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
];

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "운영자",
  USER: "회원",
};

export default function Sidebar({ session }: { session: JwtPayload | null }) {
  const pathname = usePathname();
  const router = useRouter();

  const nav = session?.role === "ADMIN" ? ADMIN_NAV : USER_NAV;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col h-screen" style={{ backgroundColor: "#0A1628", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
      {/* 로고 */}
      <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Link href="/" className="block">
          <span className="text-white font-black text-xl tracking-tighter">ROOT</span>
          <p className="text-white/30 text-xs mt-0.5 font-medium">자산 운영 플랫폼</p>
        </Link>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-orange-500/15 text-orange-400"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* 유저 정보 + 로그아웃 */}
      <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {session && (
          <div className="mb-3">
            <p className="text-white/80 text-sm font-semibold truncate">{session.email}</p>
            <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium bg-orange-500/15 text-orange-400">
              {ROLE_LABEL[session.role] ?? session.role}
            </span>
          </div>
        )}
        <Link
          href="/settings"
          className="block w-full text-sm text-white/25 hover:text-white/60 transition-colors py-1 font-medium mb-1"
        >
          설정 (비밀번호 변경)
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm text-white/25 hover:text-white/60 transition-colors py-1 font-medium"
        >
          로그아웃 →
        </button>
      </div>
    </aside>
  );
}
