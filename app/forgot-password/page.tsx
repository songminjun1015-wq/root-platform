"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "오류가 발생했습니다."); return; }
      setDone(true);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#0A1628" }}>
      <div className="w-full max-w-sm">
        <Link href="/login" className="text-white font-black text-xl tracking-tighter block mb-10">ROOT</Link>

        {done ? (
          <div>
            <div className="w-12 h-12 bg-orange-500/15 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white mb-2 tracking-tight">이메일을 확인하세요</h1>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              <span className="text-white/70">{email}</span>으로<br/>비밀번호 재설정 링크를 발송했습니다.<br/>링크는 1시간 후 만료됩니다.
            </p>
            <Link href="/login" className="text-orange-400 text-sm font-semibold hover:text-orange-300 transition-colors">
              ← 로그인으로 돌아가기
            </Link>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-black text-white mb-2 tracking-tight">비밀번호 찾기</h1>
            <p className="text-white/40 text-sm mb-8">가입한 이메일을 입력하면 재설정 링크를 보내드립니다.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-1.5">이메일</label>
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-400 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-50 transition-colors">
                {loading ? "발송 중..." : "재설정 링크 받기"}
              </button>
            </form>

            <p className="text-center text-sm text-white/30 mt-6">
              <Link href="/login" className="text-orange-400 font-semibold hover:text-orange-300 transition-colors">
                ← 로그인으로 돌아가기
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
