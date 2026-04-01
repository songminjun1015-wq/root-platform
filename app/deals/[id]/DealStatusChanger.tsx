"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_FLOW = ["NEW", "REVIEWING", "MATCHED", "NEGOTIATING", "WON", "LOST"] as const;
type DealStatus = (typeof STATUS_FLOW)[number];

const STATUS_COLORS: Record<DealStatus, string> = {
  NEW: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  REVIEWING: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
  MATCHED: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  NEGOTIATING: "bg-purple-100 text-purple-700 hover:bg-purple-200",
  WON: "bg-green-100 text-green-700 hover:bg-green-200",
  LOST: "bg-red-100 text-red-600 hover:bg-red-200",
};

export default function DealStatusChanger({
  dealId,
  currentStatus,
}: {
  dealId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function changeStatus(status: DealStatus) {
    setError("");
    setLoading(status);
    try {
        const res = await fetch(`/api/deals/${dealId}/status`, {
        method: "POST",
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
    <section className="bg-white rounded-lg border border-gray-200 p-5">
      <h2 className="font-semibold text-gray-700 mb-3">상태 변경</h2>
      <div className="flex flex-wrap gap-2">
        {STATUS_FLOW.map((status) => (
          <button
            key={status}
            onClick={() => changeStatus(status)}
            disabled={status === currentStatus || loading !== null}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              status === currentStatus
                ? "ring-2 ring-offset-1 ring-blue-500 " + STATUS_COLORS[status]
                : STATUS_COLORS[status]
            }`}
          >
            {loading === status ? "변경 중..." : status}
            {status === currentStatus && " ✓"}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </section>
  );
}
