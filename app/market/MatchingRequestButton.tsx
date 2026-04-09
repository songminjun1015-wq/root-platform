"use client";

import { useState } from "react";

export default function MatchingRequestButton({ assetId }: { assetId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleClick() {
    if (status === "done") return;
    setStatus("loading");
    try {
      const res = await fetch(`/api/market/${assetId}/request`, { method: "POST" });
      if (res.ok) setStatus("done");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="w-full bg-green-50 border border-green-200 text-green-600 px-4 py-2.5 rounded-xl text-sm font-semibold text-center">
        ✓ 운영자에게 전달되었습니다
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={status === "loading"}
      className="w-full bg-orange-500 hover:bg-orange-400 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
    >
      {status === "loading" ? "전송 중..." : status === "error" ? "다시 시도" : "매칭 요청"}
    </button>
  );
}
