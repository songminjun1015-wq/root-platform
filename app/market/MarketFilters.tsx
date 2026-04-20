"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

const CONDITION_LABEL: Record<string, string> = {
  A: "최상",
  B: "양호",
  C: "보통",
  D: "부품용",
};

export default function MarketFilters({
  categories,
  regions,
  totalCount,
}: {
  categories: string[];
  regions: string[];
  totalCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q        = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const region   = searchParams.get("region") ?? "";
  const grade    = searchParams.get("grade") ?? "";
  const priceMax = searchParams.get("priceMax") ?? "";

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const hasFilter = q || category || region || grade || priceMax;

  function clearAll() {
    router.replace(pathname, { scroll: false });
  }

  return (
    <div className="mb-6 space-y-3">
      {/* 검색바 */}
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
        </svg>
        <input
          type="text"
          value={q}
          onChange={(e) => update("q", e.target.value)}
          placeholder="자산명, 제조사, 모델명 검색"
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
        />
      </div>

      {/* 필터 행 */}
      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={category}
          onChange={(e) => update("category", e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          <option value="">전체 카테고리</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={region}
          onChange={(e) => update("region", e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          <option value="">전체 지역</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <select
          value={grade}
          onChange={(e) => update("grade", e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          <option value="">전체 등급</option>
          {Object.entries(CONDITION_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v} ({k})</option>
          ))}
        </select>

        <select
          value={priceMax}
          onChange={(e) => update("priceMax", e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          <option value="">가격 제한 없음</option>
          <option value="1000000">100만원 이하</option>
          <option value="5000000">500만원 이하</option>
          <option value="10000000">1,000만원 이하</option>
          <option value="30000000">3,000만원 이하</option>
          <option value="50000000">5,000만원 이하</option>
          <option value="100000000">1억원 이하</option>
        </select>

        {hasFilter && (
          <button
            onClick={clearAll}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors px-2 py-2"
          >
            필터 초기화 ×
          </button>
        )}

        <span className="ml-auto text-sm text-slate-400 font-medium">
          {totalCount}건
        </span>
      </div>
    </div>
  );
}
