import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/app/_components/StatusBadge";
import DealStatusChanger from "./DealStatusChanger";

export default async function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const deal = await prisma.deal.findUnique({
    where: { id },
    include: {
      asset: true,
      request: true,
      createdBy: { select: { name: true, companyName: true } },
    },
  });

  if (!deal) notFound();

  // 권한 체크
  if (user.role !== "ADMIN") {
    const isMyAsset = deal.asset?.ownerUserId === user.id;
    const isMyRequest = deal.request?.requesterUserId === user.id;
    if (!isMyAsset && !isMyRequest) redirect("/deals");
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/deals" className="hover:text-gray-600">딜 관리</Link>
        <span>/</span>
        <span className="text-gray-600">{deal.dealTitle}</span>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{deal.dealTitle}</h1>
            <StatusBadge status={deal.status} />
          </div>
          <p className="text-gray-500 text-sm">
            생성: {deal.createdBy.name} ({deal.createdBy.companyName}) · {new Date(deal.createdAt).toLocaleDateString("ko-KR")}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* ADMIN 상태 변경 */}
        {user.role === "ADMIN" && (
          <DealStatusChanger dealId={deal.id} currentStatus={deal.status} />
        )}

        {/* 딜 정보 */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">딜 정보</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">상태</p>
              <StatusBadge status={deal.status} />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">예상금액</p>
              <p className="text-sm font-semibold text-gray-900">
                {deal.expectedValue ? `₩${Number(deal.expectedValue).toLocaleString()}` : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">최종금액</p>
              <p className="text-sm font-semibold text-gray-900">
                {deal.finalValue ? `₩${Number(deal.finalValue).toLocaleString()}` : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">최종 수정</p>
              <p className="text-sm text-gray-700">{new Date(deal.updatedAt).toLocaleDateString("ko-KR")}</p>
            </div>
          </div>
          {deal.notes && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1.5">운영 메모</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-3 leading-relaxed">{deal.notes}</p>
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* 연결 자산 */}
          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">연결된 자산</h2>
            {!deal.asset ? (
              <p className="text-sm text-gray-400">연결된 자산 없음</p>
            ) : (
              <div className="space-y-3">
                <Link href={`/assets/${deal.asset.id}`} className="text-blue-600 font-medium text-sm hover:underline block">
                  {deal.asset.assetTitle}
                </Link>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: "카테고리", value: deal.asset.category },
                    { label: "수량", value: `${deal.asset.quantity}${deal.asset.unit ?? ""}` },
                    { label: "지역", value: deal.asset.locationRegion },
                    { label: "상태등급", value: deal.asset.conditionGrade },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="font-medium text-gray-800 mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* 연결 요청 */}
          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">연결된 요청</h2>
            {!deal.request ? (
              <p className="text-sm text-gray-400">연결된 요청 없음</p>
            ) : (
              <div className="space-y-3">
                <Link href={`/requests/${deal.request.id}`} className="text-blue-600 font-medium text-sm hover:underline block">
                  {deal.request.requestTitle}
                </Link>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: "카테고리", value: deal.request.category },
                    { label: "희망 수량", value: String(deal.request.desiredQuantity) },
                    { label: "지역", value: deal.request.preferredRegion },
                    { label: "긴급도", value: deal.request.urgencyLevel },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="font-medium text-gray-800 mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
