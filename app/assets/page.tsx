import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/app/_components/StatusBadge";

export default async function AssetsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const assets = await prisma.asset.findMany({
    where: user.role === "ADMIN" ? {} : { ownerUserId: user.id },
    orderBy: { createdAt: "desc" },
    include: { owner: { select: { name: true, companyName: true } } },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {user.role === "ADMIN" ? "자산 관리" : "내 자산"}
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">{assets.length}개의 자산</p>
        </div>
        <Link href="/assets/new" className="bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-800 transition-colors">
          + 자산 등록
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {assets.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm font-medium">등록된 자산이 없습니다.</p>
            <Link href="/assets/new" className="mt-3 inline-block text-indigo-600 text-sm font-semibold hover:underline">
              첫 자산 등록하기 →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100">
              <tr>
                {["자산명", "카테고리", "수량", "상태등급", "지역", "희망가", "상태", ""].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assets.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <Link href={`/assets/${a.id}`} className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                      {a.assetTitle}
                    </Link>
                    {user.role === "ADMIN" && (
                      <p className="text-xs text-slate-400 mt-0.5">{a.owner.companyName}</p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-slate-500">{a.category}</td>
                  <td className="px-5 py-4 text-slate-500">{a.quantity}{a.unit ? ` ${a.unit}` : ""}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600">
                      {a.conditionGrade}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{a.locationRegion}</td>
                  <td className="px-5 py-4 text-slate-500 font-medium">
                    {a.askingPrice ? `₩${Number(a.askingPrice).toLocaleString()}` : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-5 py-4">
                    {(user.role === "ADMIN" || a.ownerUserId === user.id) && (
                      <Link href={`/assets/${a.id}/edit`} className="text-xs text-slate-400 font-medium hover:text-indigo-600 transition-colors">
                        수정
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
