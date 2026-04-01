"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_FLOW = ["PENDING_REVIEW", "ACTIVE", "MATCHED", "CLOSED", "WITHDRAWN"] as const;
type RequestStatus = (typeof STATUS_FLOW)[number];

const STATUS_LABEL: Record<RequestStatus, string> = {
  PENDING_REVIEW: "검토 대기",
  ACTIVE: "활성",
  MATCHED: "매칭됨",
  CLOSED: "처리완료",
  WITHDRAWN: "철회",
};

const STATUS_COLORS: Record<RequestStatus, string> = {
  PENDING_REVIEW: "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100",
  ACTIVE: "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100",
  MATCHED: "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100",
  CLOSED: "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200",
  WITHDRAWN: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
};

export default function RequestStatusChanger({
  requestId,
  currentStatus,
}: {
  requestId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function changeStatus(status: RequestStatus) {
    setError("");
    setLoading(status);
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "상태 변경 실패"); return; }
      router.refresh();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-5">
      <h2 className="text-sm font-bold text-slate-700 mb-3">상태 변경</h2>
      <div className="flex flex-col gap-2">
        {STATUS_FLOW.map((status) => {
          const isActive = status === currentStatus;
          return (
            <button
              key={status}
              onClick={() => changeStatus(status)}
              disabled={isActive || loading !== null}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                isActive ? `${STATUS_COLORS[status]} opacity-100 ring-2 ring-offset-1 ring-indigo-400` : `${STATUS_COLORS[status]} disabled:opacity-40`
              }`}
            >
              <span>{STATUS_LABEL[status]}</span>
              {isActive && <span className="text-xs">현재</span>}
              {loading === status && <span className="text-xs">변경 중...</span>}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </section>
  );
}
