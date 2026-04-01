const ASSET_COLORS: Record<string, string> = {
  PENDING_REVIEW: "bg-amber-50 text-amber-700 border border-amber-200",
  ACTIVE: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  MATCHED: "bg-blue-50 text-blue-700 border border-blue-200",
  SOLD: "bg-gray-100 text-gray-600 border border-gray-200",
  WITHDRAWN: "bg-red-50 text-red-600 border border-red-200",
};

const REQUEST_COLORS: Record<string, string> = {
  PENDING_REVIEW: "bg-amber-50 text-amber-700 border border-amber-200",
  ACTIVE: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  MATCHED: "bg-blue-50 text-blue-700 border border-blue-200",
  CLOSED: "bg-gray-100 text-gray-600 border border-gray-200",
  WITHDRAWN: "bg-red-50 text-red-600 border border-red-200",
};

const DEAL_COLORS: Record<string, string> = {
  NEW: "bg-gray-100 text-gray-600 border border-gray-200",
  REVIEWING: "bg-amber-50 text-amber-700 border border-amber-200",
  MATCHED: "bg-blue-50 text-blue-700 border border-blue-200",
  NEGOTIATING: "bg-purple-50 text-purple-700 border border-purple-200",
  WON: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  LOST: "bg-red-50 text-red-600 border border-red-200",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING_REVIEW: "검토 대기",
  ACTIVE: "활성",
  MATCHED: "매칭됨",
  SOLD: "판매완료",
  WITHDRAWN: "철회",
  CLOSED: "처리완료",
  NEW: "신규",
  REVIEWING: "검토 중",
  NEGOTIATING: "협상 중",
  WON: "거래성사",
  LOST: "거래불성사",
};

const ALL_COLORS = { ...ASSET_COLORS, ...REQUEST_COLORS, ...DEAL_COLORS };

export default function StatusBadge({ status }: { status: string }) {
  const cls = ALL_COLORS[status] ?? "bg-gray-100 text-gray-600 border border-gray-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
