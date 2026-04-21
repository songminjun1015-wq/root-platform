"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "root_beta_banner_dismissed";

export default function BetaBanner() {
  const [visible, setVisible] = useState(false);
  const feedbackUrl = process.env.NEXT_PUBLIC_FEEDBACK_URL;

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) !== "1") setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {}
    setVisible(false);
  };

  return (
    <div className="sticky top-0 z-40 bg-amber-50 border-b border-amber-200 text-amber-900">
      <div className="flex items-center gap-3 px-4 py-2 text-sm">
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold tracking-wide bg-amber-500 text-white rounded">
            BETA
          </span>
          <span className="hidden sm:inline">테스트 중인 서비스입니다.</span>
          <span className="sm:hidden">베타 서비스</span>
        </span>
        <span className="flex-1 text-amber-800 hidden md:inline">
          예상치 못한 오류나 불편한 점을 알려주시면 큰 도움이 됩니다.
        </span>
        {feedbackUrl && (
          <a
            href={feedbackUrl}
            target={feedbackUrl.startsWith("http") ? "_blank" : undefined}
            rel={feedbackUrl.startsWith("http") ? "noopener noreferrer" : undefined}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded transition-colors"
          >
            피드백 보내기
          </a>
        )}
        <button
          onClick={dismiss}
          aria-label="배너 닫기"
          className="p-1 -mr-1 rounded hover:bg-amber-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
