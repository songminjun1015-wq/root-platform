"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const URGENCY = [
  { value: "LOW", label: "낮음" },
  { value: "MEDIUM", label: "보통" },
  { value: "HIGH", label: "높음" },
  { value: "URGENT", label: "긴급" },
] as const;

interface Form {
  requestTitle: string; category: string; desiredQuantity: string;
  preferredRegion: string; urgencyLevel: string;
  budgetMin: string; budgetMax: string; description: string;
}

export default function RequestEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/requests/${id}`).then((r) => r.json()).then((json) => {
      if (!json.request) { setError("요청을 불러올 수 없습니다."); return; }
      const req = json.request;
      setForm({
        requestTitle: req.requestTitle,
        category: req.category,
        desiredQuantity: String(req.desiredQuantity),
        preferredRegion: req.preferredRegion,
        urgencyLevel: req.urgencyLevel,
        budgetMin: req.budgetMin ?? "",
        budgetMax: req.budgetMax ?? "",
        description: req.description ?? "",
      });
    });
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => prev ? { ...prev, [name]: value } : prev);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setError(""); setLoading(true);
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestTitle: form.requestTitle,
          category: form.category,
          desiredQuantity: Number(form.desiredQuantity),
          preferredRegion: form.preferredRegion,
          urgencyLevel: form.urgencyLevel,
          budgetMin: form.budgetMin ? Number(form.budgetMin) : null,
          budgetMax: form.budgetMax ? Number(form.budgetMax) : null,
          description: form.description || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "수정 실패"); return; }
      router.push(`/requests/${id}`);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  if (!form) return (
    <div className="p-8 max-w-2xl mx-auto">
      {error ? <p className="text-red-600 text-sm">{error}</p> : <p className="text-gray-400 text-sm">불러오는 중...</p>}
    </div>
  );

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/requests" className="hover:text-gray-600">구매 요청</Link>
        <span>/</span>
        <Link href={`/requests/${id}`} className="hover:text-gray-600">상세</Link>
        <span>/</span>
        <span className="text-gray-600">수정</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">요청 수정</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">요청명 *</label>
          <input name="requestTitle" value={form.requestTitle} onChange={handleChange} required
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">카테고리 *</label>
            <input name="category" value={form.category} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">희망 수량 *</label>
            <input name="desiredQuantity" type="number" min="1" value={form.desiredQuantity} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">지역 *</label>
          <input name="preferredRegion" value={form.preferredRegion} onChange={handleChange} required
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">긴급도 *</label>
          <div className="flex gap-2">
            {URGENCY.map((u) => (
              <button key={u.value} type="button"
                onClick={() => setForm((prev) => prev ? { ...prev, urgencyLevel: u.value } : prev)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  form.urgencyLevel === u.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}>
                {u.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">최소 예산 (원)</label>
            <input name="budgetMin" type="number" min="0" value={form.budgetMin} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">최대 예산 (원)</label>
            <input name="budgetMax" type="number" min="0" value={form.budgetMax} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">설명</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4}
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5"><p className="text-sm text-red-600">{error}</p></div>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {loading ? "저장 중..." : "저장하기"}
          </button>
          <Link href={`/requests/${id}`} className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
