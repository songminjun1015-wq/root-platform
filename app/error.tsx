"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#0A1628" }}>
      <div className="text-center max-w-md">
        <p className="text-7xl font-black text-orange-500 mb-4">500</p>
        <h1 className="text-2xl font-bold text-white mb-2">오류가 발생했습니다</h1>
        <p className="text-white/40 text-sm mb-8 leading-relaxed">
          일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="bg-orange-500 hover:bg-orange-400 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
          >
            다시 시도
          </button>
          <a
            href="/dashboard"
            className="text-white/50 hover:text-white text-sm font-medium transition-colors py-2.5"
          >
            대시보드로 이동
          </a>
        </div>
        {error.digest && (
          <p className="mt-6 text-xs text-white/20">오류 코드: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
