"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { JwtPayload } from "@/lib/jwt";

const ADMIN_NAV = [
  { href: "/dashboard", label: "대시보드", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/assets", label: "자산 관리", icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" },
  { href: "/requests", label: "구매 요청", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { href: "/deals", label: "딜 관리", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const USER_NAV = [
  { href: "/dashboard", label: "대시보드", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/assets", label: "내 자산", icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" },
  { href: "/requests", label: "구매 요청", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { href: "/deals", label: "진행 중인 딜", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "운영자",
  USER: "회원",
};

const ROLE_COLOR: Record<string, string> = {
  ADMIN: "bg-indigo-50 text-indigo-700",
  USER: "bg-slate-100 text-slate-600",
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
    <aside className="w-60 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-screen">
      {/* 로고 */}
      <div className="px-6 py-5 border-b border-slate-100">
        <span className="text-slate-900 font-black text-xl tracking-tighter">ROOT</span>
        <p className="text-slate-400 text-xs mt-0.5 font-medium">자산 운영 플랫폼</p>
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
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
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
      <div className="border-t border-slate-100 px-4 py-4">
        {session && (
          <div className="mb-3">
            <p className="text-slate-900 text-sm font-semibold truncate">{session.email}</p>
            <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLOR[session.role] ?? "bg-slate-100 text-slate-600"}`}>
              {ROLE_LABEL[session.role] ?? session.role}
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm text-slate-400 hover:text-slate-700 transition-colors py-1 font-medium"
        >
          로그아웃 →
        </button>
      </div>
    </aside>
  );
}
