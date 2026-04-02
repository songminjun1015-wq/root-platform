import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/app/_components/StatusBadge";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const isAdmin = user.role === "ADMIN";

  const [stats, recentAssets, recentRequests, recentDeals] = await Promise.all([
    isAdmin
      ? Promise.all([
          prisma.asset.count(),
          prisma.request.count(),
          prisma.deal.count(),
          prisma.deal.count({ where: { status: "WON" } }),
        ])
      : Promise.all([
          prisma.asset.count({ where: { ownerUserId: user.id } }),
          prisma.request.count({ where: { requesterUserId: user.id } }),
          prisma.deal.count({ where: { OR: [{ asset: { ownerUserId: user.id } }, { request: { requesterUserId: user.id } }] } }),
          prisma.deal.count({ where: { status: "WON", OR: [{ asset: { ownerUserId: user.id } }, { request: { requesterUserId: user.id } }] } }),
        ]),

    isAdmin
      ? prisma.asset.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
      : prisma.asset.findMany({ where: { ownerUserId: user.id }, orderBy: { createdAt: "desc" }, take: 5 }),

    isAdmin
      ? prisma.request.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
      : prisma.request.findMany({ where: { requesterUserId: user.id }, orderBy: { createdAt: "desc" }, take: 5 }),

    isAdmin
      ? prisma.deal.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
      : prisma.deal.findMany({
          where: { OR: [{ asset: { ownerUserId: user.id } }, { request: { requesterUserId: user.id } }] },
          orderBy: { createdAt: "desc" }, take: 5,
        }),
  ]);

  const statCards = isAdmin
    ? [
        { label: "전체 자산", value: stats[0], icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" },
        { label: "전체 요청", value: stats[1], icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
        { label: "전체 딜", value: stats[2], icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
        { label: "거래 성사", value: stats[3], icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
      ]
    : [
        { label: "내 자산", value: stats[0], icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" },
        { label: "구매 요청", value: stats[1], icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
        { label: "진행 딜", value: stats[2], icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
        { label: "거래 성사", value: stats[3], icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
      ];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          안녕하세요, <span className="text-orange-500">{user.name}</span>님
        </h1>
        <p className="text-slate-400 text-sm mt-1 font-medium">{user.companyName}</p>
      </div>

      {/* 스탯 카드 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl p-5 hover:shadow-md transition-shadow"
            style={{ backgroundColor: "#0A1628" }}
          >
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg mb-4 bg-orange-500/15">
              <svg className="w-[14px] h-[14px] text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
              </svg>
              <span className="text-xs font-semibold text-orange-400">{card.label}</span>
            </div>
            <p className="text-3xl font-black text-white">
              {card.value}<span className="text-lg font-semibold text-white/30 ml-1">건</span>
            </p>
          </div>
        ))}
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-wrap gap-2.5 mb-8">
        <Link
          href="/assets/new"
          className="bg-orange-500 hover:bg-orange-400 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          + 자산 등록
        </Link>
        <Link
          href="/requests/new"
          className="border text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
          style={{ borderColor: "#e2e8f0", backgroundColor: "white" }}
        >
          + 구매 요청
        </Link>
        {isAdmin && (
          <Link
            href="/deals/new"
            className="border text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            style={{ borderColor: "#e2e8f0", backgroundColor: "white" }}
          >
            + 딜 생성
          </Link>
        )}
      </div>

      {/* 최근 항목 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {recentAssets.length > 0 && (
          <RecentSection title="최근 자산" href="/assets" items={recentAssets.map((a) => ({
            id: a.id, href: `/assets/${a.id}`, title: a.assetTitle, status: a.status, sub: a.locationRegion,
          }))} />
        )}
        {recentRequests.length > 0 && (
          <RecentSection title="최근 요청" href="/requests" items={recentRequests.map((r) => ({
            id: r.id, href: `/requests/${r.id}`, title: r.requestTitle, status: r.status, sub: r.preferredRegion,
          }))} />
        )}
        {recentDeals.length > 0 && (
          <RecentSection title="최근 딜" href="/deals" items={recentDeals.map((d) => ({
            id: d.id, href: `/deals/${d.id}`, title: d.dealTitle, status: d.status,
            sub: d.expectedValue ? `₩${Number(d.expectedValue).toLocaleString()}` : "-",
          }))} />
        )}
      </div>
    </div>
  );
}

function RecentSection({ title, href, items }: {
  title: string; href: string;
  items: { id: string; href: string; title: string; status: string; sub: string }[];
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-700">{title}</h2>
        <Link href={href} className="text-xs text-orange-500 font-semibold hover:text-orange-400 transition-colors">전체 보기 →</Link>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
        {items.map((item) => (
          <Link key={item.id} href={item.href} className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors">
            <div className="min-w-0 flex-1 mr-3">
              <p className="text-sm text-slate-800 font-semibold truncate">{item.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
            </div>
            <StatusBadge status={item.status} />
          </Link>
        ))}
      </div>
    </section>
  );
}
