import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/app/_components/StatusBadge";

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
  if (user.role === "SELLER" && asset.ownerUserId !== user.id) redirect("/assets");

  const canEdit = user.role === "ADMIN" || asset.ownerUserId === user.id;

  const infoFields = [
    { label: "카테고리", value: asset.category },
    { label: "서브카테고리", value: asset.subcategory },
    { label: "제조사", value: asset.manufacturer },
    { label: "모델명", value: asset.modelName },
    { label: "수량", value: `${asset.quantity}${asset.unit ? ` ${asset.unit}` : ""}` },
    { label: "상태등급", value: asset.conditionGrade },
    { label: "지역", value: asset.locationRegion },
    { label: "상세위치", value: asset.locationDetail },
    { label: "희망가", value: asset.askingPrice ? `₩${Number(asset.askingPrice).toLocaleString()}` : null },
    { label: "가격협의", value: asset.priceNegotiable ? "가능" : "불가" },
    { label: "해체 필요", value: asset.dismantlingRequired ? "예" : "아니오" },
    { label: "운반 필요", value: asset.transportRequired ? "예" : "아니오" },
    { label: "설치 필요", value: asset.installationRequired ? "예" : "아니오" },
    { label: "등록자", value: `${asset.owner.name} (${asset.owner.companyName})` },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* 브레드크럼 */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/assets" className="hover:text-gray-600">자산 관리</Link>
        <span>/</span>
        <span className="text-gray-600">{asset.assetTitle}</span>
      </div>

      {/* 헤더 */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{asset.assetTitle}</h1>
            <StatusBadge status={asset.status} />
          </div>
          <p className="text-gray-500 text-sm">{asset.category}{asset.subcategory ? ` · ${asset.subcategory}` : ""}</p>
        </div>
        {canEdit && (
          <Link href={`/assets/${id}/edit`} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            수정
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* 기본 정보 */}
          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">기본 정보</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {infoFields.map(({ label, value }) =>
                value ? (
                  <div key={label}>
                    <dt className="text-xs text-gray-400 mb-0.5">{label}</dt>
                    <dd className="text-sm text-gray-800 font-medium">{value}</dd>
                  </div>
                ) : null
              )}
            </dl>
            {asset.description && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <dt className="text-xs text-gray-400 mb-1.5">설명</dt>
                <dd className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{asset.description}</dd>
              </div>
            )}
          </section>

          {/* 연결된 딜 */}
          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              연결된 딜 <span className="text-gray-400 font-normal">({asset.deals.length})</span>
            </h2>
            {asset.deals.length === 0 ? (
              <p className="text-sm text-gray-400">연결된 딜 없음</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {asset.deals.map((d) => (
                  <Link key={d.id} href={`/deals/${d.id}`} className="flex items-center justify-between py-3 hover:text-blue-600 transition-colors">
                    <span className="text-sm font-medium">{d.dealTitle}</span>
                    <StatusBadge status={d.status} />
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* 사이드 요약 */}
        <div>
          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">요약</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">희망가</p>
                <p className="text-xl font-bold text-gray-900 mt-0.5">
                  {asset.askingPrice ? `₩${Number(asset.askingPrice).toLocaleString()}` : "협의"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">수량</p>
                <p className="text-sm font-medium text-gray-800">{asset.quantity}{asset.unit ? ` ${asset.unit}` : ""}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">지역</p>
                <p className="text-sm font-medium text-gray-800">{asset.locationRegion}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">등록일</p>
                <p className="text-sm font-medium text-gray-800">{new Date(asset.createdAt).toLocaleDateString("ko-KR")}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
