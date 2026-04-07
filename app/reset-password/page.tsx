"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("비밀번호가 일치하지 않습니다."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "오류가 발생했습니다."); return; }
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div>
        <h1 className="text-2xl font-black text-white mb-2 tracking-tight">유효하지 않은 링크</h1>
        <p className="text-white/40 text-sm mb-6">비밀번호 찾기를 다시 시도해주세요.</p>
        <Link href="/forgot-password" className="text-orange-400 text-sm font-semibold hover:text-orange-300 transition-colors">
          비밀번호 찾기 →
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div>
        <div className="w-12 h-12 bg-orange-500/15 rounded-2xl flex items-center justify-center mb-6">
          <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-white mb-2 tracking-tight">비밀번호 변경 완료</h1>
        <p className="text-white/40 text-sm">잠시 후 로그인 페이지로 이동합니다.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-2 tracking-tight">새 비밀번호 설정</h1>
      <p className="text-white/40 text-sm mb-8">영문+숫자 조합 8자 이상으로 입력해주세요.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-white/70 mb-1.5">새 비밀번호</label>
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
            style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-white/70 mb-1.5">비밀번호 확인</label>
          <input
            type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
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

        <button type="submit" disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-400 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-50 transition-colors">
          {loading ? "변경 중..." : "비밀번호 변경하기"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#0A1628" }}>
      <div className="w-full max-w-sm">
        <Link href="/login" className="text-white font-black text-xl tracking-tighter block mb-10">ROOT</Link>
        <Suspense fallback={<p className="text-white/40 text-sm">불러오는 중...</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
