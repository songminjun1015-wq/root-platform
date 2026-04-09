"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  assetId: string;
  status: string;
  isAdmin: boolean;
}

export default function DeleteAssetButton({ assetId, status, isAdmin }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isDirect = isAdmin || status === "PENDING_REVIEW";
  const label = isDirect ? "삭제" : "삭제 요청";
  const confirmMsg = isDirect
    ? "자산을 삭제하면 복구할 수 없습니다. 삭제하시겠습니까?"
    : "삭제 요청을 하면 자산이 '철회됨' 상태로 변경됩니다. 계속하시겠습니까?";

  async function handleClick() {
    if (!confirm(confirmMsg)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/assets/${assetId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) { alert(json.error ?? "오류가 발생했습니다."); return; }
      if (json.deleted) {
        router.push("/assets");
        router.refresh();
      } else {
        router.refresh();
      }
    } catch {
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-white border border-red-200 text-red-500 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      {loading ? "처리 중..." : label}
    </button>
  );
}
