"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "로그인에 실패했습니다.");
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0A1628" }}>
      {/* 왼쪽 브랜드 패널 */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-white/10">
        <Link href="/" className="text-white font-black text-2xl tracking-tighter">ROOT</Link>
        <div>
          <p className="text-6xl font-black text-white leading-[1.05] mb-6">
            유휴 장비를<br />
            <span className="text-orange-400">수익으로.</span>
          </p>
          <p className="text-white/40 text-base leading-relaxed">
            물류·건설 유휴자산 B2B 거래 플랫폼.<br />
            등록부터 거래 완료까지, ROOT가 함께합니다.
          </p>
        </div>
        <p className="text-white/20 text-xs">© ROOT. All rights reserved.</p>
      </div>

      {/* 오른쪽 폼 */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Link href="/" className="lg:hidden text-white font-black text-xl tracking-tighter block mb-8">ROOT</Link>
            <h1 className="text-2xl font-black text-white tracking-tight">로그인</h1>
            <p className="text-white/40 text-sm mt-1.5">계정 정보를 입력해주세요.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-1.5">이메일</label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@company.com"
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-1.5">비밀번호</label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-400 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-50 transition-colors mt-2"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <p className="text-center text-sm text-white/30 mt-6">
            계정이 없으신가요?{" "}
            <Link href="/register" className="text-orange-400 font-semibold hover:text-orange-300 transition-colors">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
