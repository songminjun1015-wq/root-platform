"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ImageUploader from "@/app/_components/ImageUploader";

interface Form {
  assetTitle: string; category: string; quantity: string;
  conditionGrade: string; locationRegion: string;
  askingPrice: string; priceNegotiable: boolean; description: string;
  imageUrls: string[];
}

export default function AssetEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/assets/${id}`).then((r) => r.json()).then((json) => {
      if (!json.asset) { setError("자산을 불러올 수 없습니다."); return; }
      const a = json.asset;
      setForm({
        assetTitle: a.assetTitle, category: a.category, quantity: String(a.quantity),
        conditionGrade: a.conditionGrade, locationRegion: a.locationRegion,
        askingPrice: a.askingPrice ?? "", priceNegotiable: a.priceNegotiable, description: a.description ?? "",
        imageUrls: a.imageUrls ?? [],
      });
    });
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.target as HTMLInputElement;
    setForm((prev) => prev ? {
      ...prev,
      [target.name]: target.type === "checkbox" ? target.checked : target.value,
    } : prev);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setError(""); setLoading(true);
    try {
      const res = await fetch(`/api/assets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetTitle: form.assetTitle, category: form.category,
          quantity: Number(form.quantity), conditionGrade: form.conditionGrade,
          locationRegion: form.locationRegion,
          askingPrice: form.askingPrice ? Number(form.askingPrice) : null,
          priceNegotiable: form.priceNegotiable,
          description: form.description || null,
          imageUrls: form.imageUrls.filter(Boolean),
        }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "수정 실패"); return; }
      router.push(`/assets/${id}`);
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
        <Link href="/assets" className="hover:text-gray-600">자산 관리</Link>
        <span>/</span>
        <Link href={`/assets/${id}`} className="hover:text-gray-600">상세</Link>
        <span>/</span>
        <span className="text-gray-600">수정</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">자산 수정</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        {([
          { label: "자산명 *", name: "assetTitle", required: true },
          { label: "카테고리 *", name: "category", required: true },
          { label: "상태등급 *", name: "conditionGrade", required: true },
          { label: "지역 *", name: "locationRegion", required: true },
        ] as const).map(({ label, name, required }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <input name={name} value={form[name as keyof Form] as string} onChange={handleChange} required={required}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">수량 *</label>
            <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">희망가 (원)</label>
            <input name="askingPrice" type="number" min="0" value={form.askingPrice} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input name="priceNegotiable" type="checkbox" checked={form.priceNegotiable} onChange={handleChange}
            className="rounded border-gray-300 text-blue-600" />
          <label className="text-sm text-gray-700">가격 협의 가능</label>
        </div>
        <ImageUploader
          value={form.imageUrls}
          onChange={(urls) => setForm((prev) => prev ? { ...prev, imageUrls: urls } : prev)}
        />

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
          <Link href={`/assets/${id}`} className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
