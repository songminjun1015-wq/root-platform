"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "#f8fafc" }}>
          <div style={{ textAlign: "center", maxWidth: "28rem" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>
              예기치 못한 오류가 발생했습니다
            </h1>
            <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
              잠시 후 다시 시도해주세요. 계속 문제가 발생하면 관리자에게 문의해주세요.
            </p>
            <a
              href="/"
              style={{ display: "inline-block", padding: "0.625rem 1.25rem", background: "#0f172a", color: "white", borderRadius: "0.5rem", textDecoration: "none", fontWeight: 500 }}
            >
              홈으로
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
