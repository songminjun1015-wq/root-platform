import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import RequestsTable from "./RequestsTable";

export default async function RequestsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const requests = await prisma.request.findMany({
    where: user.role === "ADMIN" ? {} : { requesterUserId: user.id },
    orderBy: { createdAt: "desc" },
    include: { requester: { select: { name: true, companyName: true } } },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">구매 요청</h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">{requests.length}개의 요청</p>
        </div>
        <Link href="/requests/new" className="bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-800 transition-colors">
          + 요청 등록
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {requests.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm font-medium">등록된 요청이 없습니다.</p>
            {(user.role === "ADMIN" || user.role === "BUYER") && (
              <Link href="/requests/new" className="mt-3 inline-block text-indigo-600 text-sm font-semibold hover:underline">
                첫 요청 등록하기 →
              </Link>
            )}
          </div>
        ) : (
          <RequestsTable
            requests={requests.map((r) => ({
              id: r.id,
              requestTitle: r.requestTitle,
              category: r.category,
              desiredQuantity: r.desiredQuantity,
              urgencyLevel: r.urgencyLevel,
              preferredRegion: r.preferredRegion,
              budgetMin: r.budgetMin ? Number(r.budgetMin) : null,
              budgetMax: r.budgetMax ? Number(r.budgetMax) : null,
              status: r.status,
              requesterUserId: r.requesterUserId,
              requester: { companyName: r.requester.companyName },
            }))}
            isAdmin={user.role === "ADMIN"}
            currentUserId={user.id}
          />
        )}
      </div>
    </div>
  );
}
