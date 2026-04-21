"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import BetaBanner from "./BetaBanner";
import type { JwtPayload } from "@/lib/jwt";

const PUBLIC_PATHS = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/terms", "/privacy"];

export default function AppShell({
  session,
  children,
}: {
  session: JwtPayload | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.includes(pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isPublic) {
    return (
      <>
        <BetaBanner />
        {children}
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* 모바일 오버레이 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar session={session} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* 메인 */}
      <main className="flex-1 overflow-y-auto">
        <BetaBanner />
        {/* 모바일 헤더 */}
        <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 -ml-1 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="메뉴 열기"
          >
            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-base font-black text-slate-900 tracking-tighter">ROOT</span>
        </div>
        {children}
      </main>
    </div>
  );
}
