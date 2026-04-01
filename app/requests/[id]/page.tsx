import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/app/_components/StatusBadge";
import RequestStatusChanger from "./RequestStatusChanger";

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const request = await prisma.request.findUnique({
    where: { id },
    include: {
      requester: { select: { name: true, companyName: true } },
      deals: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!request) notFound();
  if (user.role !== "ADMIN" && request.requesterUserId !== user.id) redirect("/requests");

  const canEdit = user.role === "ADMIN" || request.requesterUserId === user.id;

  const infoFields = [
    { label: "카테고리", value: request.category },
    { label: "서브카테고리", value: request.subcategory },
    { label: "희망 수량", value: String(request.desiredQuantity) },
    { label: "지역", value: request.preferredRegion },
    { label: "긴급도", value: request.urgencyLevel },
    { label: "필요 일자", value: request.neededByDate ? new Date(request.neededByDate).toLocaleDateString("ko-KR") : null },
    {
      label: "예산",
      value: request.budgetMin || request.budgetMax
        ? `${request.budgetMin ? `₩${Number(request.budgetMin).toLocaleString()}` : ""}${request.budgetMin && request.budgetMax ? " ~ " : ""}${request.budgetMax ? `₩${Number(request.budgetMax).toLocaleString()}` : ""}`
        : null,
    },
    { label: "운반 필요", value: request.transportRequired ? "예" : "아니오" },
    { label: "설치 필요", value: request.installationRequired ? "예" : "아니오" },
    { label: "요청자", value: `${request.requester.name} (${request.requester.companyName})` },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/requests" className="hover:text-gray-600">구매 요청</Link>
        <span>/</span>
        <span className="text-gray-600">{request.requestTitle}</span>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{request.requestTitle}</h1>
            <StatusBadge status={request.status} />
          </div>
          <p className="text-gray-500 text-sm">{request.category}{request.subcategory ? ` · ${request.subcategory}` : ""}</p>
        </div>
        {canEdit && (
          <Link href={`/requests/${id}/edit`} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            수정
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
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
            {request.description && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <dt className="text-xs text-gray-400 mb-1.5">설명</dt>
                <dd className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{request.description}</dd>
              </div>
            )}
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              연결된 딜 <span className="text-gray-400 font-normal">({request.deals.length})</span>
            </h2>
            {request.deals.length === 0 ? (
              <p className="text-sm text-gray-400">연결된 딜 없음</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {request.deals.map((d) => (
                  <Link key={d.id} href={`/deals/${d.id}`} className="flex items-center justify-between py-3 hover:text-blue-600 transition-colors">
                    <span className="text-sm font-medium">{d.dealTitle}</span>
                    <StatusBadge status={d.status} />
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-4">
          {user.role === "ADMIN" && (
            <RequestStatusChanger requestId={id} currentStatus={request.status} />
          )}
          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">요약</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">예산</p>
                <p className="text-lg font-bold text-gray-900 mt-0.5">
                  {request.budgetMax ? `₩${Number(request.budgetMax).toLocaleString()} 이하` : "협의"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">희망 수량</p>
                <p className="text-sm font-medium text-gray-800">{request.desiredQuantity}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">지역</p>
                <p className="text-sm font-medium text-gray-800">{request.preferredRegion}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">긴급도</p>
                <p className="text-sm font-medium text-gray-800">{request.urgencyLevel}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">등록일</p>
                <p className="text-sm font-medium text-gray-800">{new Date(request.createdAt).toLocaleDateString("ko-KR")}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

