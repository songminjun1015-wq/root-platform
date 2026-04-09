"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApproveAssetButton({ assetId }: { assetId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleApprove() {
    setLoading(true);
    try {
      const res = await fetch(`/api/assets/${assetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACTIVE" }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 disabled:opacity-50 transition-colors"
    >
      {loading ? "처리 중..." : "승인"}
    </button>
  );
}
