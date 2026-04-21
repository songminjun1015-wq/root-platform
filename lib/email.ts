import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const FROM = process.env.EMAIL_FROM ?? "ROOT <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ── 공통 이메일 래퍼 ──────────────────────────────
async function send(to: string, subject: string, html: string) {
  const { error } = await getResend().emails.send({ from: FROM, to, subject, html });
  if (error) console.error("[email]", error);
}

// ── 비밀번호 재설정 ───────────────────────────────
export async function sendPasswordResetEmail(to: string, token: string) {
  const link = `${APP_URL}/reset-password?token=${token}`;
  await send(
    to,
    "[ROOT] 비밀번호 재설정 안내",
    `
    <div style="font-family:'Pretendard Variable',Pretendard,-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Noto Sans KR','Segoe UI',Roboto,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
      <h2 style="color:#0A1628;font-size:22px;font-weight:900;margin:0 0 8px;">비밀번호 재설정</h2>
      <p style="color:#64748b;font-size:14px;margin:0 0 24px;">
        아래 버튼을 클릭하면 비밀번호를 재설정할 수 있습니다.<br/>
        링크는 <strong>1시간</strong> 후 만료됩니다.
      </p>
      <a href="${link}"
        style="display:inline-block;background:#F97316;color:#fff;font-weight:700;font-size:14px;
               padding:12px 28px;border-radius:10px;text-decoration:none;">
        비밀번호 재설정하기 →
      </a>
      <p style="color:#94a3b8;font-size:12px;margin:24px 0 0;">
        본인이 요청하지 않았다면 이 메일을 무시하세요.
      </p>
      <hr style="border:none;border-top:1px solid #f1f5f9;margin:24px 0;"/>
      <p style="color:#cbd5e1;font-size:11px;margin:0;">ROOT · 유휴장비 B2B 거래 플랫폼</p>
    </div>
    `
  );
}

// ── 자산 등록 승인 알림 (유저에게) ───────────────────
export async function sendAssetApprovedEmail(to: string, assetTitle: string, assetId: string) {
  const link = `${APP_URL}/assets/${assetId}`;
  await send(
    to,
    `[ROOT] 자산 등록이 승인되었습니다 — ${assetTitle}`,
    `
    <div style="font-family:'Pretendard Variable',Pretendard,-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Noto Sans KR','Segoe UI',Roboto,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
      <h2 style="color:#0A1628;font-size:22px;font-weight:900;margin:0 0 8px;">자산 등록 승인</h2>
      <p style="color:#64748b;font-size:14px;margin:0 0 8px;">
        등록하신 자산이 검토를 완료하고 매칭 가능 상태로 변경되었습니다.
      </p>
      <p style="color:#0A1628;font-size:16px;font-weight:700;margin:0 0 24px;">📦 ${assetTitle}</p>
      <a href="${link}"
        style="display:inline-block;background:#F97316;color:#fff;font-weight:700;font-size:14px;
               padding:12px 28px;border-radius:10px;text-decoration:none;">
        자산 확인하기 →
      </a>
      <hr style="border:none;border-top:1px solid #f1f5f9;margin:24px 0;"/>
      <p style="color:#cbd5e1;font-size:11px;margin:0;">ROOT · 유휴장비 B2B 거래 플랫폼</p>
    </div>
    `
  );
}

// ── 딜 상태 변경 알림 ─────────────────────────────
export async function sendDealStatusEmail(
  to: string,
  dealTitle: string,
  dealId: string,
  newStatus: string
) {
  const statusLabel: Record<string, string> = {
    REVIEWING:   "검토 중",
    MATCHED:     "매칭 확정",
    NEGOTIATING: "협상 중",
    WON:         "거래 성사 🎉",
    LOST:        "거래 불성사",
  };
  const label = statusLabel[newStatus] ?? newStatus;
  const link = `${APP_URL}/deals/${dealId}`;

  await send(
    to,
    `[ROOT] 딜 상태가 변경되었습니다 — ${dealTitle}`,
    `
    <div style="font-family:'Pretendard Variable',Pretendard,-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Noto Sans KR','Segoe UI',Roboto,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
      <h2 style="color:#0A1628;font-size:22px;font-weight:900;margin:0 0 8px;">딜 상태 변경</h2>
      <p style="color:#64748b;font-size:14px;margin:0 0 8px;">진행 중인 딜의 상태가 업데이트되었습니다.</p>
      <p style="color:#0A1628;font-size:15px;font-weight:700;margin:0 0 4px;">${dealTitle}</p>
      <p style="margin:0 0 24px;">
        <span style="display:inline-block;background:#FFF7ED;color:#F97316;font-weight:700;
                     font-size:13px;padding:4px 12px;border-radius:999px;border:1px solid #fed7aa;">
          ${label}
        </span>
      </p>
      <a href="${link}"
        style="display:inline-block;background:#F97316;color:#fff;font-weight:700;font-size:14px;
               padding:12px 28px;border-radius:10px;text-decoration:none;">
        딜 확인하기 →
      </a>
      <hr style="border:none;border-top:1px solid #f1f5f9;margin:24px 0;"/>
      <p style="color:#cbd5e1;font-size:11px;margin:0;">ROOT · 유휴장비 B2B 거래 플랫폼</p>
    </div>
    `
  );
}

// ── 어드민에게 매칭 요청 알림 ────────────────────
export async function sendMatchingRequestEmail(
  adminEmail: string,
  assetTitle: string,
  assetId: string,
  requesterName: string,
  requesterCompany: string,
  requesterEmail: string
) {
  const link = `${APP_URL}/assets/${assetId}`;
  await send(
    adminEmail,
    `[ROOT 어드민] 매칭 요청 — ${assetTitle}`,
    `
    <div style="font-family:'Pretendard Variable',Pretendard,-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Noto Sans KR','Segoe UI',Roboto,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
      <h2 style="color:#0A1628;font-size:22px;font-weight:900;margin:0 0 8px;">매칭 요청이 들어왔습니다</h2>
      <p style="color:#64748b;font-size:14px;margin:0 0 16px;">아래 회원이 자산에 관심을 표시했습니다.</p>
      <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">
        <tr><td style="color:#94a3b8;font-size:12px;padding:6px 0;">자산명</td>
            <td style="color:#0A1628;font-size:14px;font-weight:600;">${assetTitle}</td></tr>
        <tr><td style="color:#94a3b8;font-size:12px;padding:6px 0;">요청자</td>
            <td style="color:#0A1628;font-size:14px;font-weight:600;">${requesterName} (${requesterCompany})</td></tr>
        <tr><td style="color:#94a3b8;font-size:12px;padding:6px 0;">이메일</td>
            <td style="color:#0A1628;font-size:14px;font-weight:600;">${requesterEmail}</td></tr>
      </table>
      <a href="${link}"
        style="display:inline-block;background:#F97316;color:#fff;font-weight:700;font-size:14px;
               padding:12px 28px;border-radius:10px;text-decoration:none;">
        자산 확인하기 →
      </a>
      <hr style="border:none;border-top:1px solid #f1f5f9;margin:24px 0;"/>
      <p style="color:#cbd5e1;font-size:11px;margin:0;">ROOT 운영 알림</p>
    </div>
    `
  );
}

// ── 어드민에게 새 자산 등록 알림 ──────────────────
export async function sendNewAssetNotifyAdmin(
  adminEmail: string,
  assetTitle: string,
  assetId: string,
  ownerName: string,
  companyName: string
) {
  const link = `${APP_URL}/assets/${assetId}`;
  await send(
    adminEmail,
    `[ROOT 어드민] 새 자산 등록 — ${assetTitle}`,
    `
    <div style="font-family:'Pretendard Variable',Pretendard,-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Noto Sans KR','Segoe UI',Roboto,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
      <h2 style="color:#0A1628;font-size:22px;font-weight:900;margin:0 0 8px;">새 자산 등록됨</h2>
      <p style="color:#64748b;font-size:14px;margin:0 0 16px;">검토가 필요한 자산이 등록되었습니다.</p>
      <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">
        <tr><td style="color:#94a3b8;font-size:12px;padding:6px 0;">자산명</td>
            <td style="color:#0A1628;font-size:14px;font-weight:600;">${assetTitle}</td></tr>
        <tr><td style="color:#94a3b8;font-size:12px;padding:6px 0;">등록자</td>
            <td style="color:#0A1628;font-size:14px;font-weight:600;">${ownerName} (${companyName})</td></tr>
      </table>
      <a href="${link}"
        style="display:inline-block;background:#0A1628;color:#fff;font-weight:700;font-size:14px;
               padding:12px 28px;border-radius:10px;text-decoration:none;">
        자산 검토하기 →
      </a>
      <hr style="border:none;border-top:1px solid #f1f5f9;margin:24px 0;"/>
      <p style="color:#cbd5e1;font-size:11px;margin:0;">ROOT 운영 알림</p>
    </div>
    `
  );
}
