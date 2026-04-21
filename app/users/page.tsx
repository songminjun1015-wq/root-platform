"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  companyName: string;
  role: "ADMIN" | "USER";
  createdAt: string;
  _count: { assets: number; requests: number };
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => {
        if (r.status === 403) { router.push("/dashboard"); return null; }
        return r.json();
      })
      .then((json) => { if (json) setUsers(json.users); })
      .finally(() => setLoading(false));
  }, [router]);

  async function toggleRole(user: User) {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    if (!confirm(`${user.name}님의 역할을 ${newRole === "ADMIN" ? "운영자" : "회원"}로 변경할까요?`)) return;

    setUpdating(user.id);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, role: newRole } : u));
      }
    } finally {
      setUpdating(null);
    }
  }

  const filtered = users.filter((u) =>
    u.name.includes(search) || u.email.includes(search) || u.companyName.includes(search)
  );

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const userCount  = users.filter((u) => u.role === "USER").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">가입 현황</h1>
        <p className="text-slate-400 text-sm mt-1">전체 가입 유저를 관리합니다.</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
        {[
          { label: "전체 가입", value: users.length, color: "text-slate-900" },
          { label: "회원",     value: userCount,     color: "text-slate-900" },
          { label: "운영자",   value: adminCount,    color: "text-orange-500 font-black" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 hover:shadow-sm hover:border-orange-200 transition-all">
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className={`text-2xl sm:text-3xl font-black ${s.color}`}>{s.value}<span className="text-base sm:text-lg font-semibold text-slate-300 ml-1">명</span></p>
          </div>
        ))}
      </div>

      {/* 검색 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="이름, 이메일, 회사명 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* 테이블 */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">불러오는 중...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">가입된 유저가 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">이름 / 회사</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">이메일</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500">자산</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500">요청</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">가입일</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500">역할</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{user.companyName}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3.5 text-center text-slate-700 font-medium">{user._count.assets}</td>
                  <td className="px-4 py-3.5 text-center text-slate-700 font-medium">{user._count.requests}</td>
                  <td className="px-4 py-3.5 text-slate-400 text-xs">
                    {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => toggleRole(user)}
                      disabled={updating === user.id}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 ${
                        user.role === "ADMIN"
                          ? "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {updating === user.id ? "..." : user.role === "ADMIN" ? "운영자" : "회원"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
