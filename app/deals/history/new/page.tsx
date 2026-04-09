"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SERVICE_OPTIONS = [
  { value: "AS_AVAILABLE",           label: "A/S 가능" },
  { value: "LOADING_AVAILABLE",      label: "상차도 가능" },
  { value: "INSTALLATION_AVAILABLE", label: "설치 가능" },
  { value: "TEST_RUN_AVAILABLE",     label: "시운전 가능" },
  { value: "INSTALLMENT_AVAILABLE",  label: "할부 가능" },
];

export default function HistoricalDealNewPage() {
  const router = useRouter();
  const [serviceOptions, setServiceOptions] = useState<string[]>([]);
  const [purchasedAtUnknown, setPurchasedAtUnknown] = useState(false);
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

    const manufacturedYear = get("manufacturedYear");
    const manufacturedMonth = get("manufacturedMonth");

    try {
      const res = await fetch("/api/deals/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // 딜 정보
          dealTitle:    get("dealTitle").trim(),
          finalValue:   get("finalValue") ? Number(get("finalValue")) : null,
          closedAt:     get("closedAt") || null,
          sellerName:   get("sellerName").trim() || null,
          sellerCompany: get("sellerCompany").trim() || null,
          buyerName:    get("buyerName").trim() || null,
          buyerCompany: get("buyerCompany").trim() || null,
          notes:        get("notes").trim() || null,
          // 자산 정보
          assetTitle:      get("assetTitle").trim(),
          category:        get("category").trim(),
          subcategory:     get("subcategory").trim() || null,
          manufacturer:    get("manufacturer").trim() || null,
          modelName:       get("modelName").trim() || null,
          quantity:        Number(get("quantity")) || 1,
          unit:            get("unit").trim() || null,
          conditionGrade:  get("conditionGrade"),
          locationRegion:  get("locationRegion").trim(),
          locationDetail:  get("locationDetail").trim() || null,
          askingPrice:     get("askingPrice") ? Number(get("askingPrice")) : null,
          description:     get("description").trim() || null,
          manufacturedYear:  manufacturedYear && manufacturedYear !== "unknown" ? Number(manufacturedYear) : null,
          manufacturedMonth: manufacturedMonth && manufacturedMonth !== "unknown" ? Number(manufacturedMonth) : null,
          purchasedAt:     purchasedAtUnknown ? null : (get("purchasedAt") || null),
          purchasedFrom:   get("purchasedFrom").trim() || null,
          purchasePrice:   get("purchasePrice") ? Number(get("purchasePrice")) : null,
          serviceOptions,
        }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "오류가 발생했습니다."); return; }
      router.push(`/deals/${json.deal.id}`);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 sm:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/deals" className="hover:text-slate-600">딜 관리</Link>
        <span>/</span>
        <span className="text-slate-600">과거 거래 입력</span>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">과거 거래 수기 입력</h1>
        <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full">ADMIN</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── 거래 정보 ── */}
        <Section title="거래 정보">
          <Field label="딜명 *" name="dealTitle" required placeholder="예: 지게차 매각 — (주)대한물류" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="거래 완료일" name="closedAt" type="date" />
            <Field label="최종 거래금액 (원)" name="finalValue" type="number" min="0" placeholder="예: 8500000" />
          </div>
          <Field label="메모" name="notes" placeholder="거래 관련 내부 메모" />
        </Section>

        {/* ── 판매자 / 구매자 ── */}
        <Section title="거래 당사자">
          <div className="grid grid-cols-2 gap-4">
            <Field label="판매자 이름" name="sellerName" placeholder="예: 김철수" />
            <Field label="판매자 회사" name="sellerCompany" placeholder="예: (주)대한물류" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="구매자 이름" name="buyerName" placeholder="예: 박지훈" />
            <Field label="구매자 회사" name="buyerCompany" placeholder="예: 신흥산업" />
          </div>
        </Section>

        {/* ── 자산 기본 정보 ── */}
        <Section title="자산 기본 정보">
          <Field label="자산명 *" name="assetTitle" required placeholder="예: 지게차 2.5t Toyota 8FD25" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="카테고리 *" name="category" required placeholder="예: 물류장비" />
            <Field label="세부 카테고리" name="subcategory" placeholder="예: 지게차" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="제조사" name="manufacturer" placeholder="예: Toyota" />
            <Field label="모델명" name="modelName" placeholder="예: 8FD25" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="수량 *" name="quantity" type="number" min="1" required defaultValue="1" />
            <Field label="단위" name="unit" placeholder="예: 대" />
          </div>
          <div className="grid grid-cols-2 gap-4">
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
            <Field label="희망가 (원)" name="askingPrice" type="number" min="0" placeholder="예: 8500000" />
          </div>
          <Field label="지역 *" name="locationRegion" required placeholder="예: 경기도 성남시" />
          <Field label="상세 주소" name="locationDetail" placeholder="예: 성남시 분당구" />
        </Section>

        {/* ── 장비 이력 ── */}
        <Section title="장비 이력">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">제조연도</label>
              <select name="manufacturedYear"
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="">선택</option>
                <option value="unknown">모름</option>
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
                <option value="unknown">모름</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{m}월</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-slate-700">구매일자</label>
              <label className="flex items-center gap-1.5 text-sm text-slate-500 cursor-pointer">
                <input type="checkbox" checked={purchasedAtUnknown} onChange={(e) => setPurchasedAtUnknown(e.target.checked)}
                  className="rounded border-slate-300 text-orange-500" />
                모름
              </label>
            </div>
            <input name="purchasedAt" type="date" disabled={purchasedAtUnknown}
              className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-slate-50 disabled:text-slate-300" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="구매처" name="purchasedFrom" placeholder="예: 현대중장비" />
            <Field label="구매금액 (원)" name="purchasePrice" type="number" min="0" placeholder="예: 15000000" />
          </div>
        </Section>

        {/* ── 서비스 옵션 ── */}
        <Section title="서비스 옵션">
          <p className="text-xs text-slate-400 -mt-1 mb-3">거래 당시 제공된 서비스를 선택하세요.</p>
          <div className="flex flex-wrap gap-2">
            {SERVICE_OPTIONS.map((opt) => {
              const active = serviceOptions.includes(opt.value);
              return (
                <button key={opt.value} type="button" onClick={() => toggleOption(opt.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    active ? "bg-orange-500 text-white border-orange-500" : "bg-white text-slate-600 border-slate-200 hover:border-orange-300"
                  }`}>
                  {active ? "✓ " : ""}{opt.label}
                </button>
              );
            })}
          </div>
        </Section>

        {/* ── 설명 ── */}
        <Section title="설명">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">자산 설명</label>
            <textarea name="description" rows={4} placeholder="자산 상태, 사용 이력, 특이사항 등을 입력하세요."
              className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
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
            {loading ? "저장 중..." : "거래 기록 저장"}
          </button>
          <Link href="/deals"
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

function Field({ label, name, type = "text", required = false, placeholder, min, defaultValue }: {
  label: string; name: string; type?: string; required?: boolean;
  placeholder?: string; min?: string; defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input name={name} type={type} required={required} placeholder={placeholder} min={min} defaultValue={defaultValue}
        className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
    </div>
  );
}
