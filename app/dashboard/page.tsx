import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/app/_components/StatusBadge";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const isAdmin = user.role === "ADMIN";

  if (isAdmin) {
    const [
      pendingAssets,
      pendingRequests,
      newDeals,
      activeDeals,
      totalAssets,
      totalRequests,
      totalDeals,
      wonDeals,
      recentPendingAssets,
      recentPendingRequests,
      recentNewDeals,
    ] = await Promise.all([
      prisma.asset.count({ where: { status: "PENDING_REVIEW" } }),
      prisma.request.count({ where: { status: "PENDING_REVIEW" } }),
      prisma.deal.count({ where: { status: "NEW" } }),
      prisma.deal.count({ where: { status: { in: ["REVIEWING", "MATCHED", "NEGOTIATING"] } } }),
      prisma.asset.count(),
      prisma.request.count(),
      prisma.deal.count(),
      prisma.deal.count({ where: { status: "WON" } }),
      prisma.asset.findMany({
        where: { status: "PENDING_REVIEW" },
        orderBy: { createdAt: "asc" },
        take: 5,
        include: { owner: { select: { companyName: true } } },
      }),
      prisma.request.findMany({
        where: { status: "PENDING_REVIEW" },
        orderBy: { createdAt: "asc" },
        take: 5,
        include: { requester: { select: { companyName: true } } },
      }),
      prisma.deal.findMany({
        where: { status: "NEW" },
        orderBy: { createdAt: "asc" },
        take: 5,
      }),
    ]);

    const todoItems = [
      { label: "검토 대기 자산", count: pendingAssets, href: "/assets", color: "bg-amber-50 border-amber-200 text-amber-700", dot: "bg-amber-400", urgent: pendingAssets > 0 },
      { label: "검토 대기 요청", count: pendingRequests, href: "/requests", color: "bg-amber-50 border-amber-200 text-amber-700", dot: "bg-amber-400", urgent: pendingRequests > 0 },
      { label: "신규 딜", count: newDeals, href: "/deals", color: "bg-blue-50 border-blue-200 text-blue-700", dot: "bg-blue-400", urgent: newDeals > 0 },
      { label: "진행 중 딜", count: activeDeals, href: "/deals", color: "bg-purple-50 border-purple-200 text-purple-700", dot: "bg-purple-400", urgent: false },
    ];

    const totalCards = [
      { label: "전체 자산", value: totalAssets, href: "/assets" },
      { label: "전체 요청", value: totalRequests, href: "/requests" },
      { label: "전체 딜", value: totalDeals, href: "/deals" },
      { label: "거래 성사", value: wonDeals, href: "/deals" },
    ];

    const hasTodo = pendingAssets > 0 || pendingRequests > 0 || newDeals > 0;

    return (
      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            안녕하세요, <span className="text-orange-500">{user.name}</span>님
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">운영자 대시보드</p>
        </div>

        {/* 할 일 섹션 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-bold text-slate-700">지금 할 일</h2>
            {hasTodo && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white text-xs font-bold">
                {pendingAssets + pendingRequests + newDeals}
              </span>
            )}
          </div>
          {todoItems.filter((item) => item.count > 0).length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4">
              <p className="text-sm text-slate-400 font-medium">처리할 항목이 없습니다 ✓</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {todoItems.filter((item) => item.count > 0).map((item) => (
                <Link key={item.label} href={item.href}
                  className={`relative border rounded-2xl p-4 transition-all hover:shadow-sm ${item.color}`}>
                  <span className={`absolute top-3 right-3 w-2 h-2 rounded-full ${item.dot}`} />
                  <p className="text-2xl font-black mb-1">{item.count}</p>
                  <p className="text-xs font-semibold">{item.label}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 전체 현황 */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-slate-700 mb-3">전체 현황</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {totalCards.map((card) => (
              <Link key={card.label} href={card.href}
                className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-orange-200 hover:shadow-sm transition-all">
                <p className="text-3xl font-black text-slate-900">
                  {card.value}<span className="text-base font-semibold text-slate-300 ml-1">건</span>
                </p>
                <p className="text-xs font-semibold text-slate-400 mt-1">{card.label}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* 바로가기 버튼 */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          <Link href="/assets/new" className="bg-orange-500 hover:bg-orange-400 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            + 자산 등록
          </Link>
          <Link href="/requests/new" className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
            + 구매 요청
          </Link>
          <Link href="/deals/new" className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
            + 딜 생성
          </Link>
        </div>

        {/* 처리 대기 목록 */}
        {(recentPendingAssets.length > 0 || recentPendingRequests.length > 0 || recentNewDeals.length > 0) && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {recentPendingAssets.length > 0 && (
              <AdminTodoList title="검토 대기 자산" href="/assets" items={recentPendingAssets.map((a) => ({
                id: a.id, href: `/assets/${a.id}`, title: a.assetTitle, sub: a.owner.companyName, status: a.status,
              }))} />
            )}
            {recentPendingRequests.length > 0 && (
              <AdminTodoList title="검토 대기 요청" href="/requests" items={recentPendingRequests.map((r) => ({
                id: r.id, href: `/requests/${r.id}`, title: r.requestTitle, sub: r.requester.companyName, status: r.status,
              }))} />
            )}
            {recentNewDeals.length > 0 && (
              <AdminTodoList title="신규 딜" href="/deals" items={recentNewDeals.map((d) => ({
                id: d.id, href: `/deals/${d.id}`, title: d.dealTitle,
                sub: d.expectedValue ? `₩${Number(d.expectedValue).toLocaleString()}` : "금액 미정",
                status: d.status,
              }))} />
            )}
          </div>
        )}
      </div>
    );
  }

  // ── 일반 유저 ──────────────────────────────────────
  const [stats, recentAssets, recentRequests, recentDeals] = await Promise.all([
    Promise.all([
      prisma.asset.count({ where: { ownerUserId: user.id } }),
      prisma.request.count({ where: { requesterUserId: user.id } }),
      prisma.deal.count({ where: { OR: [{ asset: { ownerUserId: user.id } }, { request: { requesterUserId: user.id } }] } }),
      prisma.deal.count({ where: { status: "WON", OR: [{ asset: { ownerUserId: user.id } }, { request: { requesterUserId: user.id } }] } }),
    ]),
    prisma.asset.findMany({ where: { ownerUserId: user.id }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.request.findMany({ where: { requesterUserId: user.id }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.deal.findMany({
      where: { OR: [{ asset: { ownerUserId: user.id } }, { request: { requesterUserId: user.id } }] },
      orderBy: { createdAt: "desc" }, take: 5,
    }),
  ]);

  const statCards = [
    { label: "내 자산", value: stats[0], icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4", href: "/assets" },
    { label: "구매 요청", value: stats[1], icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", href: "/requests" },
    { label: "진행 딜", value: stats[2], icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", href: "/deals" },
    { label: "거래 성사", value: stats[3], icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", href: "/deals" },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          안녕하세요, <span className="text-orange-500">{user.name}</span>님
        </h1>
        <p className="text-slate-400 text-sm mt-1 font-medium">{user.companyName}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href}
            className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-sm hover:border-orange-200 transition-all">
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg mb-4 bg-orange-50">
              <svg className="w-[14px] h-[14px] text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
              </svg>
              <span className="text-xs font-semibold text-orange-500">{card.label}</span>
            </div>
            <p className="text-3xl font-black text-slate-900">
              {card.value}<span className="text-lg font-semibold text-slate-300 ml-1">건</span>
            </p>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-2.5 mb-8">
        <Link href="/assets/new" className="bg-orange-500 hover:bg-orange-400 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          + 자산 등록
        </Link>
        <Link href="/requests/new" className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
          + 구매 요청
        </Link>
      </div>

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

function AdminTodoList({ title, href, items }: {
  title: string; href: string;
  items: { id: string; href: string; title: string; sub: string; status: string }[];
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
