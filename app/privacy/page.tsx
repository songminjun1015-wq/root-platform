import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-xl font-black text-slate-900 tracking-tighter">ROOT</Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">홈으로</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">개인정보처리방침</h1>
        <p className="text-sm text-slate-400 mb-10">최종 수정일: 2026년 4월 19일</p>

        <div className="prose prose-slate prose-sm max-w-none space-y-8">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">1. 수집하는 개인정보 항목</h2>
            <p className="text-slate-600 leading-relaxed mb-3">
              회사는 서비스 제공을 위해 아래의 개인정보를 수집합니다.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 pr-4 text-slate-700 font-semibold">구분</th>
                  <th className="text-left py-2 text-slate-700 font-semibold">수집 항목</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4">필수</td>
                  <td className="py-2">이름, 이메일, 비밀번호(암호화), 회사명</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4">선택</td>
                  <td className="py-2">연락처(구매 요청 시)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">자동 수집</td>
                  <td className="py-2">접속 IP, 접속 일시, 쿠키</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">2. 개인정보의 수집 및 이용 목적</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>회원 가입 및 관리: 회원 식별, 본인 확인, 서비스 부정 이용 방지</li>
              <li>서비스 제공: 자산 등록, 구매 요청, 매칭 중개, 거래 관리</li>
              <li>알림 발송: 자산 승인, 딜 상태 변경, 매칭 요청 등 이메일 알림</li>
              <li>서비스 개선: 통계 분석, 서비스 품질 향상</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">3. 개인정보의 보유 및 이용 기간</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>회원 탈퇴 시까지 보유하며, 탈퇴 즉시 파기합니다.</li>
              <li>관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>계약 또는 청약 철회 등에 관한 기록: 5년</li>
                  <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                  <li>소비자 불만 또는 분쟁 처리에 관한 기록: 3년</li>
                  <li>웹사이트 방문 기록: 3개월</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">4. 개인정보의 제3자 제공</h2>
            <p className="text-slate-600 leading-relaxed">
              회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
              다만, 법령에 의한 요청이 있는 경우에는 예외로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">5. 개인정보의 처리 위탁</h2>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 pr-4 text-slate-700 font-semibold">수탁업체</th>
                  <th className="text-left py-2 text-slate-700 font-semibold">위탁 업무</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4">Supabase</td>
                  <td className="py-2">데이터베이스 호스팅, 이미지 저장</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Resend</td>
                  <td className="py-2">이메일 발송</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">6. 개인정보의 파기 절차 및 방법</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>전자적 파일: 복구 불가능한 방법으로 영구 삭제</li>
              <li>비밀번호: 단방향 암호화(bcrypt) 저장, 원본 복원 불가</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">7. 이용자의 권리</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>이용자는 언제든지 자신의 개인정보를 열람, 수정, 삭제 요청할 수 있습니다.</li>
              <li>회원 탈퇴를 통해 개인정보 처리에 대한 동의를 철회할 수 있습니다.</li>
              <li>개인정보 관련 문의는 아래 연락처로 접수해주세요.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">8. 쿠키의 사용</h2>
            <p className="text-slate-600 leading-relaxed">
              회사는 로그인 인증을 위해 HTTP-only 쿠키를 사용합니다. 해당 쿠키는 세션 인증 목적으로만
              사용되며, 브라우저 설정을 통해 쿠키를 거부할 수 있습니다. 다만 이 경우 서비스 이용이
              제한될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">9. 개인정보 보호 책임자</h2>
            <div className="bg-slate-50 rounded-xl p-5 text-sm text-slate-600 space-y-1">
              <p>담당자: ROOT 운영팀</p>
              <p>이메일: support@root-platform.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">10. 방침 변경 안내</h2>
            <p className="text-slate-600 leading-relaxed">
              본 개인정보처리방침이 변경되는 경우, 변경 사항을 서비스 내 공지사항을 통해 고지합니다.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
          <span className="text-xs text-slate-300">ROOT</span>
          <Link href="/terms" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            이용약관
          </Link>
        </div>
      </footer>
    </div>
  );
}
