"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const STATUS_FLOW = ["PENDING_REVIEW", "ACTIVE", "MATCHED", "CLOSED", "WITHDRAWN"] as const;
type RequestStatus = (typeof STATUS_FLOW)[number];

const STATUS_LABEL: Record<string, string> = {
  PENDING_REVIEW: "검토 대기",
  ACTIVE: "활성",
  MATCHED: "매칭됨",
  CLOSED: "처리완료",
  WITHDRAWN: "철회",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING_REVIEW: "bg-amber-50 text-amber-700 border border-amber-200",
  ACTIVE: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  MATCHED: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  CLOSED: "bg-slate-100 text-slate-600 border border-slate-200",
  WITHDRAWN: "bg-red-50 text-red-600 border border-red-200",
};

const URGENCY_LABEL: Record<string, string> = { LOW: "낮음", MEDIUM: "보통", HIGH: "높음", URGENT: "긴급" };
const URGENCY_COLORS: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-500",
  MEDIUM: "bg-indigo-50 text-indigo-600",
  HIGH: "bg-amber-50 text-amber-600",
  URGENT: "bg-red-50 text-red-600",
};

interface Request {
  id: string;
  requestTitle: string;
  category: string;
  desiredQuantity: number;
  urgencyLevel: string;
  preferredRegion: string;
  budgetMin: number | null;
  budgetMax: number | null;
  status: string;
  requesterUserId: string;
  requester: { companyName: string };
}

export default function RequestsTable({
  requests,
  isAdmin,
  currentUserId,
}: {
  requests: Request[];
  isAdmin: boolean;
  currentUserId: string;
}) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function changeStatus(requestId: string, status: RequestStatus) {
    setError("");
    setLoading(requestId + status);
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOpenId(null);
        router.refresh();
      } else {
        const json = await res.json();
        setError(json.error ?? "상태 변경에 실패했습니다.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
    {error && (
      <div className="mx-5 mb-3 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )}
    <div className="overflow-x-auto">
    <table className="w-full text-sm min-w-[820px]">
      <thead className="border-b border-slate-100">
        <tr>
          {["요청명", "카테고리", "수량", "긴급도", "지역", "예산", "상태", ""].map((h) => (
            <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {requests.map((r) => (
          <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
            <td className="px-5 py-4">
              <Link href={`/requests/${r.id}`} className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                {r.requestTitle}
              </Link>
              {isAdmin && (
                <p className="text-xs text-slate-400 mt-0.5">{r.requester.companyName}</p>
              )}
            </td>
            <td className="px-5 py-4 text-slate-500">{r.category}</td>
            <td className="px-5 py-4 text-slate-500">{r.desiredQuantity}</td>
            <td className="px-5 py-4">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${URGENCY_COLORS[r.urgencyLevel] ?? "bg-slate-100 text-slate-500"}`}>
                {URGENCY_LABEL[r.urgencyLevel] ?? r.urgencyLevel}
              </span>
            </td>
            <td className="px-5 py-4 text-slate-500">{r.preferredRegion}</td>
            <td className="px-5 py-4 text-slate-500 text-xs font-medium">
              {r.budgetMin || r.budgetMax
                ? `${r.budgetMin ? `₩${Number(r.budgetMin).toLocaleString()}` : ""}${r.budgetMin && r.budgetMax ? " ~" : ""} ${r.budgetMax ? `₩${Number(r.budgetMax).toLocaleString()}` : ""}`.trim()
                : <span className="text-slate-300">-</span>}
            </td>
            <td className="px-5 py-4">
              {isAdmin ? (
                <div className="relative">
                  <button
                    onClick={() => setOpenId(openId === r.id ? null : r.id)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold transition-opacity hover:opacity-80 ${STATUS_COLORS[r.status] ?? "bg-slate-100 text-slate-600"}`}
                  >
                    {STATUS_LABEL[r.status] ?? r.status}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openId === r.id && (
                    <div className="absolute z-20 top-7 left-0 bg-white border border-slate-200 rounded-xl shadow-lg py-1 min-w-[120px]">
                      {STATUS_FLOW.map((s) => (
                        <button
                          key={s}
                          onClick={() => changeStatus(r.id, s)}
                          disabled={s === r.status || loading !== null}
                          className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors disabled:opacity-40 ${
                            s === r.status ? "text-indigo-600 bg-indigo-50" : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {loading === r.id + s ? "변경 중..." : STATUS_LABEL[s]}
                          {s === r.status && " ✓"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${STATUS_COLORS[r.status] ?? "bg-slate-100 text-slate-600"}`}>
                  {STATUS_LABEL[r.status] ?? r.status}
                </span>
              )}
            </td>
            <td className="px-5 py-4">
              {(isAdmin || r.requesterUserId === currentUserId) && (
                <Link href={`/requests/${r.id}/edit`} className="text-xs text-slate-400 font-medium hover:text-indigo-600 transition-colors">
                  수정
                </Link>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    </>
  );
}
