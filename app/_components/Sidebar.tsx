"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { JwtPayload } from "@/lib/jwt";

type NavItem = { href: string; label: string; icon: string };
type NavGroup = { label: string; icon: string; items: NavItem[] };

const ICONS = {
  dashboard: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  asset: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
  request: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  deal: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  users: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  market: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  chart: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  briefcase: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  swap: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
};

const ADMIN_NAV: NavGroup[] = [
  {
    label: "운영 현황",
    icon: ICONS.chart,
    items: [{ href: "/dashboard", label: "대시보드", icon: ICONS.dashboard }],
  },
  {
    label: "거래 운영",
    icon: ICONS.briefcase,
    items: [
      { href: "/assets", label: "자산 관리", icon: ICONS.asset },
      { href: "/requests", label: "구매 요청", icon: ICONS.request },
      { href: "/deals", label: "딜 관리", icon: ICONS.deal },
      { href: "/market", label: "매물 현황", icon: ICONS.market },
    ],
  },
  {
    label: "회원 관리",
    icon: ICONS.users,
    items: [{ href: "/users", label: "가입 현황", icon: ICONS.users }],
  },
];

const USER_NAV: NavGroup[] = [
  {
    label: "홈",
    icon: ICONS.home,
    items: [{ href: "/dashboard", label: "대시보드", icon: ICONS.dashboard }],
  },
  {
    label: "나의 거래",
    icon: ICONS.swap,
    items: [
      { href: "/assets", label: "내 자산", icon: ICONS.asset },
      { href: "/requests", label: "구매 요청", icon: ICONS.request },
      { href: "/deals", label: "진행 중인 딜", icon: ICONS.deal },
    ],
  },
  {
    label: "탐색",
    icon: ICONS.search,
    items: [{ href: "/market", label: "매물 현황", icon: ICONS.market }],
  },
];

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "운영자",
  USER: "회원",
};

function isItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

function findActiveGroup(nav: NavGroup[], pathname: string): string | null {
  const group = nav.find((g) => g.items.some((i) => isItemActive(pathname, i.href)));
  return group?.label ?? null;
}

export default function Sidebar({
  session,
  onClose,
}: {
  session: JwtPayload | null;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const nav = session?.role === "ADMIN" ? ADMIN_NAV : USER_NAV;

  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const active = findActiveGroup(nav, pathname);
    return new Set(active ? [active] : []);
  });

  const toggleGroup = (label: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function handleNavClick() {
    onClose?.();
  }

  return (
    <aside
      className="w-60 flex-shrink-0 flex flex-col h-screen"
      style={{ backgroundColor: "#0A1628", borderRight: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* 로고 */}
      <div
        className="px-6 py-5 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Link href="/" className="block" onClick={handleNavClick}>
          <span className="text-white font-black text-xl tracking-tighter">ROOT</span>
          <p className="text-white/30 text-xs mt-0.5 font-medium">자산 운영 플랫폼</p>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="메뉴 닫기"
          >
            <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map((group) => {
          const isOpen = expanded.has(group.label);
          const hasActiveItem = group.items.some((i) => isItemActive(pathname, i.href));

          return (
            <div key={group.label}>
              <button
                type="button"
                onClick={() => toggleGroup(group.label)}
                aria-expanded={isOpen}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  hasActiveItem
                    ? "text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={group.icon} />
                </svg>
                <span className="flex-1 text-left">{group.label}</span>
                <svg
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ${
                  isOpen ? "max-h-96 mt-0.5" : "max-h-0"
                }`}
              >
                <div className="pl-3 pr-0 py-0.5 space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = isItemActive(pathname, item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleNavClick}
                        className={`flex items-center gap-3 pl-6 pr-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-orange-500/15 text-orange-400"
                            : "text-white/40 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
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
          onClick={handleNavClick}
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
