"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).value;

    const nameVal = get("name").trim();
    const companyVal = get("companyName").trim();

    if (!nameVal || nameVal.length < 2) {
      setError("이름은 최소 2자 이상이어야 합니다.");
      setLoading(false);
      return;
    }

    if (!companyVal) {
      setError("회사명을 입력해주세요.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: get("name"),
          email: get("email"),
          password: get("password"),
          companyName: get("companyName"),
          role: "USER",
        }),
      });

      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "회원가입에 실패했습니다."); return; }

      router.push("/login?registered=1");
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12">
        <Link href="/" className="text-white font-black text-2xl tracking-tighter">ROOT</Link>
        <div>
          <p className="text-4xl font-black text-white leading-tight mb-4">
            지금 시작하세요.<br />
            <span className="text-orange-400">무료입니다.</span>
          </p>
          <p className="text-slate-400 text-base leading-relaxed">
            자산 등록도, 구매 요청도 모두 하나의 계정으로.<br />
            ROOT가 최적의 거래를 연결해드립니다.
          </p>
        </div>
        <p className="text-slate-600 text-xs">© ROOT. All rights reserved.</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Link href="/" className="lg:hidden text-slate-900 font-black text-xl tracking-tighter block mb-8">ROOT</Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">회원가입</h1>
            <p className="text-slate-500 text-sm mt-1.5">기업 정보를 입력해주세요.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "name", label: "이름", placeholder: "홍길동", type: "text" },
              { name: "companyName", label: "회사명", placeholder: "(주)대한물류", type: "text" },
              { name: "email", label: "이메일", placeholder: "name@company.com", type: "email" },
              { name: "password", label: "비밀번호", placeholder: "8자 이상", type: "password" },
            ].map(({ name, label, placeholder, type }) => (
              <div key={name}>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
                <input
                  name={name} type={type} required
                  minLength={name === "password" ? 8 : undefined}
                  placeholder={placeholder}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder:text-slate-300 transition-shadow"
                />
              </div>
            ))}

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-xl text-sm font-bold hover:bg-orange-400 disabled:opacity-50 transition-colors mt-2">
              {loading ? "가입 중..." : "가입하기"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-orange-500 font-semibold hover:underline">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
