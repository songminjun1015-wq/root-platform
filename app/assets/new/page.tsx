"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUploader from "@/app/_components/ImageUploader";

const SERVICE_OPTIONS = [
  { value: "AS_AVAILABLE",           label: "A/S 가능" },
  { value: "LOADING_AVAILABLE",      label: "상차도 가능" },
  { value: "INSTALLATION_AVAILABLE", label: "설치 가능" },
  { value: "TEST_RUN_AVAILABLE",     label: "시운전 가능" },
  { value: "INSTALLMENT_AVAILABLE",  label: "할부 가능" },
];

export default function AssetNewPage() {
  const router = useRouter();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [serviceOptions, setServiceOptions] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleOption(value: string) {
    setServiceOptions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).value;

    const data = {
      assetTitle:     get("assetTitle").trim(),
      category:       get("category").trim(),
      manufacturer:   get("manufacturer").trim() || null,
      modelName:      get("modelName").trim() || null,
      quantity:       Number(get("quantity")),
      conditionGrade: get("conditionGrade").trim(),
      locationRegion: get("locationRegion").trim(),
      askingPrice:    get("askingPrice") ? Number(get("askingPrice")) : null,
      priceNegotiable: (form.elements.namedItem("priceNegotiable") as HTMLInputElement).checked,
      description:    get("description").trim() || null,
      imageUrls:      imageUrls.filter(Boolean),
      // 장비 이력
      manufacturedYear:  get("manufacturedYear") ? Number(get("manufacturedYear")) : null,
      manufacturedMonth: get("manufacturedMonth") ? Number(get("manufacturedMonth")) : null,
      purchasedAt:       get("purchasedAt") || null,
      purchasedFrom:     get("purchasedFrom").trim() || null,
      purchasePrice:     get("purchasePrice") ? Number(get("purchasePrice")) : null,
      // 서비스 옵션
      serviceOptions,
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
    <div className="p-6 sm:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/assets" className="hover:text-gray-600">자산 관리</Link>
        <span>/</span>
        <span className="text-gray-600">자산 등록</span>
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">자산 등록</h1>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── 기본 정보 ── */}
        <Section title="기본 정보">
          <FormField label="자산명 *" name="assetTitle" required placeholder="예: 지게차 2.5t Toyota 8FD25" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="카테고리 *" name="category" required placeholder="예: 물류장비" />
            <FormField label="제조사" name="manufacturer" placeholder="예: Toyota" />
          </div>
          <FormField label="모델명" name="modelName" placeholder="예: 8FD25" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="수량 *" name="quantity" type="number" min="1" required />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">상태등급 *</label>
              <select name="conditionGrade" required
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="">선택</option>
                <option value="A">A — 최상</option>
                <option value="B">B — 양호</option>
                <option value="C">C — 보통</option>
                <option value="D">D — 부품용</option>
              </select>
            </div>
          </div>
          <FormField label="지역 *" name="locationRegion" required placeholder="예: 경기도 성남시" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="희망가 (원)" name="askingPrice" type="number" min="0" placeholder="예: 8500000" />
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input name="priceNegotiable" type="checkbox" className="rounded border-slate-300 text-orange-500" />
                가격 협의 가능
              </label>
            </div>
          </div>
        </Section>

        {/* ── 장비 이력 ── */}
        <Section title="장비 이력">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">제조연도</label>
              <select name="manufacturedYear"
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="">선택</option>
                {Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <option key={y} value={y}>{y}년</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">제조월</label>
              <select name="manufacturedMonth"
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="">선택</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{m}월</option>
                ))}
              </select>
            </div>
          </div>
          <FormField label="구매일자" name="purchasedAt" type="date" />
          <FormField label="구매처" name="purchasedFrom" placeholder="예: 현대중장비" />
          <FormField label="구매금액 (원)" name="purchasePrice" type="number" min="0" placeholder="예: 15000000" />
          <p className="text-xs text-slate-400">※ 구매금액은 본인과 운영자만 확인할 수 있습니다.</p>
        </Section>

        {/* ── 서비스 옵션 ── */}
        <Section title="서비스 옵션">
          <p className="text-xs text-slate-400 -mt-1 mb-3">제공 가능한 서비스를 모두 선택하세요.</p>
          <div className="flex flex-wrap gap-2">
            {SERVICE_OPTIONS.map((opt) => {
              const active = serviceOptions.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleOption(opt.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    active
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-slate-600 border-slate-200 hover:border-orange-300"
                  }`}
                >
                  {active ? "✓ " : ""}{opt.label}
                </button>
              );
            })}
          </div>
        </Section>

        {/* ── 사진 / 설명 ── */}
        <Section title="사진 및 설명">
          <ImageUploader value={imageUrls} onChange={setImageUrls} />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">설명</label>
            <textarea
              name="description"
              rows={4}
              placeholder="자산 상태, 사용 이력, 특이사항 등을 입력하세요."
              className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>
        </Section>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="bg-orange-500 hover:bg-orange-400 text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors">
            {loading ? "등록 중..." : "등록하기"}
          </button>
          <Link href="/assets"
            className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
      <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">{title}</h2>
      {children}
    </div>
  );
}

function FormField({ label, name, type = "text", required = false, placeholder, min }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string; min?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input name={name} type={type} required={required} placeholder={placeholder} min={min}
        className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
    </div>
  );
}
