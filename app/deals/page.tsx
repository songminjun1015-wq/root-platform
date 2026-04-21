import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/app/_components/StatusBadge";

export default async function DealsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const deals = await prisma.deal.findMany({
    where:
      user.role === "ADMIN" ? {} :
      { OR: [{ asset: { ownerUserId: user.id } }, { request: { requesterUserId: user.id } }] },
    orderBy: { createdAt: "desc" },
    include: {
      asset: { select: { assetTitle: true } },
      request: { select: { requestTitle: true } },
    },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">딜 관리</h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">{deals.length}개의 딜</p>
        </div>
        {user.role === "ADMIN" && (
          <div className="flex gap-2 flex-wrap">
            <Link href="/deals/history/new" className="border border-slate-200 bg-white text-slate-700 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap">
              + 과거 거래 입력
            </Link>
            <Link href="/deals/new" className="bg-orange-500 text-white px-3 sm:px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-400 transition-colors whitespace-nowrap">
              + 딜 생성
            </Link>
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {deals.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm font-medium">진행 중인 딜이 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="border-b border-slate-100">
              <tr>
                {["딜명", "상태", "연결 자산", "연결 요청", "예상금액", "최종금액", ""].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deals.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <Link href={`/deals/${d.id}`} className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                      {d.dealTitle}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs">
                    {d.asset?.assetTitle ?? <span className="text-slate-300">-</span>}
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs">
                    {d.request?.requestTitle ?? <span className="text-slate-300">-</span>}
                  </td>
                  <td className="px-5 py-4 text-slate-500 font-medium">
                    {d.expectedValue ? `₩${Number(d.expectedValue).toLocaleString()}` : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="px-5 py-4 text-slate-500 font-medium">
                    {d.finalValue ? `₩${Number(d.finalValue).toLocaleString()}` : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/deals/${d.id}`} className="text-xs text-slate-400 font-medium hover:text-indigo-600 transition-colors">
                      상세 →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
