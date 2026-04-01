"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUploader from "@/app/_components/ImageUploader";

export default function AssetNewPage() {
  const router = useRouter();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).value;

    const data = {
      assetTitle: get("assetTitle").trim(),
      category: get("category").trim(),
      quantity: Number(get("quantity")),
      conditionGrade: get("conditionGrade").trim(),
      locationRegion: get("locationRegion").trim(),
      askingPrice: get("askingPrice") ? Number(get("askingPrice")) : null,
      priceNegotiable: (form.elements.namedItem("priceNegotiable") as HTMLInputElement).checked,
      description: get("description").trim() || null,
      imageUrls: imageUrls.filter(Boolean),
    };

    try {
      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "오류가 발생했습니다."); return; }
      router.push(`/assets/${json.asset.id}`);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/assets" className="hover:text-gray-600">자산 관리</Link>
        <span>/</span>
        <span className="text-gray-600">자산 등록</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">자산 등록</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <FormField label="자산명 *" name="assetTitle" required placeholder="예: 지게차 2.5t Toyota 8FD25" />
        <FormField label="카테고리 *" name="category" required placeholder="예: 물류장비, 건설장비, 제조장비" />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="수량 *" name="quantity" type="number" min="1" required />
          <FormField label="상태등급 *" name="conditionGrade" required placeholder="A / B / C" />
        </div>
        <FormField label="지역 *" name="locationRegion" required placeholder="예: 경기도 성남시" />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="희망가 (원)" name="askingPrice" type="number" min="0" placeholder="예: 8500000" />
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input name="priceNegotiable" type="checkbox" className="rounded border-gray-300 text-blue-600" />
              가격 협의 가능
            </label>
          </div>
        </div>
        <ImageUploader value={imageUrls} onChange={setImageUrls} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">설명</label>
          <textarea
            name="description"
            rows={4}
            placeholder="자산 상태, 사용 이력, 특이사항 등을 입력하세요."
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {loading ? "등록 중..." : "등록하기"}
          </button>
          <Link href="/assets" className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}

function FormField({ label, name, type = "text", required = false, placeholder, min }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string; min?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input name={name} type={type} required={required} placeholder={placeholder} min={min}
        className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
    </div>
  );
}
