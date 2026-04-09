"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PriceInput from "@/app/_components/PriceInput";

const URGENCY = [
  { value: "LOW", label: "낮음" },
  { value: "MEDIUM", label: "보통" },
  { value: "HIGH", label: "높음" },
  { value: "URGENT", label: "긴급" },
] as const;

export default function RequestNewPage() {
  const router = useRouter();
  const [urgencyLevel, setUrgencyLevel] = useState("MEDIUM");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setLoading(true);

    const form = e.currentTarget;
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).value;

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestTitle: get("requestTitle").trim(),
          category: get("category").trim(),
          desiredQuantity: Number(get("desiredQuantity")),
          preferredRegion: get("preferredRegion").trim(),
          urgencyLevel,
          budgetMin: get("budgetMin") ? Number(get("budgetMin")) : null,
          budgetMax: get("budgetMax") ? Number(get("budgetMax")) : null,
          description: get("description").trim() || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "오류가 발생했습니다."); return; }
      router.push(`/requests/${json.request.id}`);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/requests" className="hover:text-gray-600">구매 요청</Link>
        <span>/</span>
        <span className="text-gray-600">요청 등록</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">구매 요청 등록</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">요청명 *</label>
          <input name="requestTitle" required placeholder="예: 지게차 2~3t 1대 구매"
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">카테고리 *</label>
            <input name="category" required placeholder="예: 물류장비"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">희망 수량 *</label>
            <input name="desiredQuantity" type="number" min="1" required
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">지역 *</label>
          <input name="preferredRegion" required placeholder="예: 경기도, 수도권 전체"
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">긴급도 *</label>
          <div className="flex gap-2">
            {URGENCY.map((u) => (
              <button key={u.value} type="button" onClick={() => setUrgencyLevel(u.value)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  urgencyLevel === u.value ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}>
                {u.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <PriceInput name="budgetMin" label="최소 예산 (원)" placeholder="0" />
          <PriceInput name="budgetMax" label="최대 예산 (원)" placeholder="예: 10,000,000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">설명</label>
          <textarea name="description" rows={4} placeholder="필요한 사양, 용도, 기타 요구사항을 입력하세요."
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none" />
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5"><p className="text-sm text-red-600">{error}</p></div>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="bg-orange-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-400 disabled:opacity-50 transition-colors">
            {loading ? "등록 중..." : "등록하기"}
          </button>
          <Link href="/requests" className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
