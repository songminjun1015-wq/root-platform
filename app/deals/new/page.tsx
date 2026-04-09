"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PriceInput from "@/app/_components/PriceInput";

interface AssetOption { id: string; assetTitle: string; }
interface RequestOption { id: string; requestTitle: string; }

export default function DealNewPage() {
  const router = useRouter();
  const [assets, setAssets] = useState<AssetOption[]>([]);
  const [requests, setRequests] = useState<RequestOption[]>([]);
  const [assetId, setAssetId] = useState("");
  const [requestId, setRequestId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadOptions() {
      const [aRes, rRes] = await Promise.all([
        fetch("/api/assets"),
        fetch("/api/requests"),
      ]);
      if (aRes.ok) setAssets((await aRes.json()).assets);
      if (rRes.ok) setRequests((await rRes.json()).requests);
    }
    loadOptions();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setLoading(true);

    const form = e.currentTarget;
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).value;

    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealTitle: get("dealTitle").trim(),
          assetId: assetId || null,
          requestId: requestId || null,
          expectedValue: get("expectedValue") ? Number(get("expectedValue")) : null,
          notes: get("notes").trim() || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "오류가 발생했습니다."); return; }
      router.push(`/deals/${json.deal.id}`);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/deals" className="hover:text-gray-600">딜 관리</Link>
        <span>/</span>
        <span className="text-gray-600">딜 생성</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">딜 생성</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">딜명 *</label>
          <input name="dealTitle" required placeholder="예: 지게차 매각 딜 - (주)로지스틱스"
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">연결 자산 (선택)</label>
          <select value={assetId} onChange={(e) => setAssetId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
            <option value="">— 선택 안함 —</option>
            {assets.map((a) => (
              <option key={a.id} value={a.id}>{a.assetTitle}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">연결 요청 (선택)</label>
          <select value={requestId} onChange={(e) => setRequestId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
            <option value="">— 선택 안함 —</option>
            {requests.map((r) => (
              <option key={r.id} value={r.id}>{r.requestTitle}</option>
            ))}
          </select>
        </div>

        <p className="text-xs text-gray-400">* 자산 또는 요청 중 최소 하나는 선택해야 합니다.</p>

        <PriceInput name="expectedValue" label="예상금액 (원)" placeholder="예: 8,500,000" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">운영 메모</label>
          <textarea name="notes" rows={4} placeholder="딜 관련 내부 메모를 입력하세요."
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5"><p className="text-sm text-red-600">{error}</p></div>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {loading ? "생성 중..." : "딜 생성"}
          </button>
          <Link href="/deals" className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
