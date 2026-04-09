import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/app/_components/StatusBadge";
import DeleteAssetButton from "./DeleteAssetButton";

const SERVICE_LABEL: Record<string, string> = {
  AS_AVAILABLE:           "A/S 가능",
  LOADING_AVAILABLE:      "상차도 가능",
  INSTALLATION_AVAILABLE: "설치 가능",
  TEST_RUN_AVAILABLE:     "시운전 가능",
  INSTALLMENT_AVAILABLE:  "할부 가능",
};

export default async function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const asset = await prisma.asset.findUnique({
    where: { id },
    include: {
      owner: { select: { name: true, companyName: true } },
      deals: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!asset) notFound();
  if (user.role !== "ADMIN" && asset.ownerUserId !== user.id) redirect("/assets");

  const canEdit = user.role === "ADMIN" || asset.ownerUserId === user.id;
  const canSeePurchasePrice = user.role === "ADMIN" || asset.ownerUserId === user.id;

  const basicFields = [
    { label: "카테고리",   value: asset.category },
    { label: "서브카테고리", value: asset.subcategory },
    { label: "제조사",     value: asset.manufacturer },
    { label: "모델명",     value: asset.modelName },
    { label: "수량",       value: `${asset.quantity}${asset.unit ? ` ${asset.unit}` : ""}` },
    { label: "상태등급",   value: asset.conditionGrade },
    { label: "지역",       value: asset.locationRegion },
    { label: "상세위치",   value: asset.locationDetail },
    { label: "희망가",     value: asset.askingPrice ? `₩${Number(asset.askingPrice).toLocaleString()}` : null },
    { label: "가격협의",   value: asset.priceNegotiable ? "가능" : "불가" },
    { label: "등록자",     value: `${asset.owner.name} (${asset.owner.companyName})` },
  ];

  const historyFields = [
    {
      label: "제조연월",
      value: asset.manufacturedYear
        ? `${asset.manufacturedYear}년${asset.manufacturedMonth ? ` ${asset.manufacturedMonth}월` : ""}`
        : null,
    },
    { label: "구매일자",  value: asset.purchasedAt ? new Date(asset.purchasedAt).toLocaleDateString("ko-KR") : null },
    { label: "구매처",    value: asset.purchasedFrom },
    {
      label: "구매금액",
      value: canSeePurchasePrice && asset.purchasePrice
        ? `₩${Number(asset.purchasePrice).toLocaleString()}`
        : null,
    },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      {/* 브레드크럼 */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/assets" className="hover:text-slate-600">자산 관리</Link>
        <span>/</span>
        <span className="text-slate-600">{asset.assetTitle}</span>
      </div>

      {/* 헤더 */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{asset.assetTitle}</h1>
            <StatusBadge status={asset.status} />
          </div>
          <p className="text-slate-400 text-sm">{asset.category}{asset.subcategory ? ` · ${asset.subcategory}` : ""}</p>
        </div>
        {canEdit && (
          <div className="flex gap-2">
            <Link href={`/assets/${id}/edit`}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              수정
            </Link>
            {asset.status !== "WITHDRAWN" && (
              <DeleteAssetButton assetId={id} status={asset.status} isAdmin={user.role === "ADMIN"} />
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">

          {/* 기본 정보 */}
          <DetailSection title="기본 정보">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {basicFields.map(({ label, value }) =>
                value ? (
                  <div key={label}>
                    <dt className="text-xs text-slate-400 mb-0.5">{label}</dt>
                    <dd className="text-sm text-slate-800 font-medium">{value}</dd>
                  </div>
                ) : null
              )}
            </dl>
            {asset.description && (
              <div className="mt-5 pt-5 border-t border-slate-100">
                <dt className="text-xs text-slate-400 mb-1.5">설명</dt>
                <dd className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{asset.description}</dd>
              </div>
            )}
          </DetailSection>

          {/* 장비 이력 */}
          {historyFields.some((f) => f.value) && (
            <DetailSection title="장비 이력">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                {historyFields.map(({ label, value }) =>
                  value ? (
                    <div key={label}>
                      <dt className="text-xs text-slate-400 mb-0.5">{label}</dt>
                      <dd className="text-sm text-slate-800 font-medium">{value}</dd>
                    </div>
                  ) : null
                )}
              </dl>
            </DetailSection>
          )}

          {/* 서비스 옵션 */}
          {asset.serviceOptions.length > 0 && (
            <DetailSection title="서비스 옵션">
              <div className="flex flex-wrap gap-2">
                {asset.serviceOptions.map((opt) => (
                  <span key={opt}
                    className="px-3 py-1.5 bg-orange-50 text-orange-600 border border-orange-200 rounded-full text-sm font-medium">
                    ✓ {SERVICE_LABEL[opt] ?? opt}
                  </span>
                ))}
              </div>
            </DetailSection>
          )}

          {/* 연결된 딜 */}
          <DetailSection title={`연결된 딜 (${asset.deals.length})`}>
            {asset.deals.length === 0 ? (
              <p className="text-sm text-slate-400">연결된 딜 없음</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {asset.deals.map((d) => (
                  <Link key={d.id} href={`/deals/${d.id}`}
                    className="flex items-center justify-between py-3 hover:text-orange-500 transition-colors">
                    <span className="text-sm font-medium">{d.dealTitle}</span>
                    <StatusBadge status={d.status} />
                  </Link>
                ))}
              </div>
            )}
          </DetailSection>
        </div>

        {/* 사이드 요약 */}
        <div className="space-y-4">
          <DetailSection title="요약">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400">희망가</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">
                  {asset.askingPrice ? `₩${Number(asset.askingPrice).toLocaleString()}` : "협의"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">수량</p>
                <p className="text-sm font-medium text-slate-800">{asset.quantity}{asset.unit ? ` ${asset.unit}` : ""}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">지역</p>
                <p className="text-sm font-medium text-slate-800">{asset.locationRegion}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">등록일</p>
                <p className="text-sm font-medium text-slate-800">{new Date(asset.createdAt).toLocaleDateString("ko-KR")}</p>
              </div>
            </div>
          </DetailSection>

          {/* 이미지 */}
          {asset.imageUrls.length > 0 && (
            <DetailSection title="사진">
              <div className="grid grid-cols-2 gap-2">
                {asset.imageUrls.map((url, i) => (
                  <img key={i} src={url} alt={`사진 ${i + 1}`}
                    className="w-full aspect-square object-cover rounded-lg border border-slate-100" />
                ))}
              </div>
            </DetailSection>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6">
      <h2 className="text-sm font-bold text-slate-700 mb-4">{title}</h2>
      {children}
    </section>
  );
}
