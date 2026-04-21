import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import MatchingRequestButton from "./MatchingRequestButton";
import MarketFilters from "./MarketFilters";

const CONDITION_LABEL: Record<string, string> = {
  A: "최상",
  B: "양호",
  C: "보통",
  D: "부품용",
};

export default async function MarketPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; region?: string; grade?: string; priceMax?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const { q, category, region, grade, priceMax } = await searchParams;

  // 필터용 옵션 목록 (전체 ACTIVE 기준)
  const allAssets = await prisma.asset.findMany({
    where: { status: "ACTIVE" },
    select: { category: true, locationRegion: true },
  });

  const categories = [...new Set(allAssets.map((a) => a.category))].sort();
  // 지역은 시/도 단위로 그룹핑
  const regions = [...new Set(
    allAssets.map((a) => {
      const parts = a.locationRegion.split(" ");
      return parts[0]; // "경기도", "서울", "부산" 등
    })
  )].sort();

  // 필터 적용해서 자산 조회
  const assets = await prisma.asset.findMany({
    where: {
      status: "ACTIVE",
      ...(category && { category }),
      ...(grade && { conditionGrade: grade }),
      ...(priceMax && { askingPrice: { lte: Number(priceMax) } }),
      ...(region && { locationRegion: { startsWith: region } }),
      ...(q && {
        OR: [
          { assetTitle: { contains: q, mode: "insensitive" } },
          { manufacturer: { contains: q, mode: "insensitive" } },
          { modelName: { contains: q, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      assetTitle: true,
      category: true,
      subcategory: true,
      manufacturer: true,
      modelName: true,
      quantity: true,
      unit: true,
      conditionGrade: true,
      locationRegion: true,
      askingPrice: true,
      priceNegotiable: true,
      imageUrls: true,
      manufacturedYear: true,
      serviceOptions: true,
      description: true,
    },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">매물 현황</h1>
        <p className="text-slate-400 text-sm mt-1 font-medium">현재 거래 가능한 장비</p>
      </div>

      <Suspense>
        <MarketFilters
          categories={categories}
          regions={regions}
          totalCount={assets.length}
        />
      </Suspense>

      {assets.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-slate-400 text-sm">검색 결과가 없습니다.</p>
          {(q || category || region || grade || priceMax) && (
            <p className="text-slate-300 text-xs mt-1">필터를 변경해보세요.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {assets.map((a) => (
            <div key={a.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-orange-200 transition-all flex flex-col">
              {/* 이미지 */}
              <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                {a.imageUrls[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.imageUrls[0]} alt={a.assetTitle} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                )}
                <span className="absolute top-2.5 left-2.5 bg-white/90 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {a.category}{a.subcategory ? ` · ${a.subcategory}` : ""}
                </span>
              </div>

              {/* 내용 */}
              <div className="p-4 flex flex-col flex-1">
                <h2 className="font-bold text-slate-900 text-sm leading-snug mb-1 line-clamp-2">{a.assetTitle}</h2>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium">
                    {CONDITION_LABEL[a.conditionGrade] ?? a.conditionGrade}등급
                  </span>
                  {a.manufacturedYear && (
                    <span className="text-xs text-slate-400">{a.manufacturedYear}년식</span>
                  )}
                  {a.manufacturer && (
                    <span className="text-xs text-slate-400">{a.manufacturer}</span>
                  )}
                </div>

                <div className="space-y-1 mb-4 text-xs text-slate-500">
                  <p>📍 {a.locationRegion}</p>
                  <p>📦 {a.quantity}{a.unit ? ` ${a.unit}` : ""}</p>
                </div>

                <div className="mt-auto">
                  <div className="mb-3">
                    {a.askingPrice ? (
                      <p className="text-lg font-black text-slate-900">
                        ₩{Number(a.askingPrice).toLocaleString()}
                        {a.priceNegotiable && <span className="text-xs font-medium text-orange-500 ml-1.5">협의 가능</span>}
                      </p>
                    ) : (
                      <p className="text-base font-bold text-orange-500">가격 협의</p>
                    )}
                  </div>
                  <MatchingRequestButton assetId={a.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
