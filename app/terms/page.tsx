import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-xl font-black text-slate-900 tracking-tighter">ROOT</Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">홈으로</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">이용약관</h1>
        <p className="text-sm text-slate-400 mb-10">최종 수정일: 2026년 4월 19일</p>

        <div className="prose prose-slate prose-sm max-w-none space-y-8">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">제1조 (목적)</h2>
            <p className="text-slate-600 leading-relaxed">
              본 약관은 ROOT(이하 &quot;회사&quot;)가 운영하는 유휴자산 B2B 거래 플랫폼(이하 &quot;서비스&quot;)의
              이용 조건 및 절차, 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">제2조 (정의)</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>&quot;서비스&quot;란 회사가 제공하는 물류·건설 유휴자산 거래 중개 플랫폼을 말합니다.</li>
              <li>&quot;이용자&quot;란 본 약관에 따라 서비스를 이용하는 회원을 말합니다.</li>
              <li>&quot;자산&quot;이란 이용자가 서비스에 등록하는 물류·건설 장비 및 설비를 말합니다.</li>
              <li>&quot;딜&quot;이란 자산의 매매 또는 중개를 위한 거래 진행 건을 말합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">제3조 (이용계약의 체결)</h2>
            <ol className="list-decimal pl-5 space-y-2 text-slate-600">
              <li>이용계약은 이용자가 본 약관에 동의하고 회원가입을 완료한 시점에 체결됩니다.</li>
              <li>회사는 아래의 경우 가입을 거절하거나 사후 이용을 제한할 수 있습니다:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>허위 정보를 기재한 경우</li>
                  <li>타인의 정보를 도용한 경우</li>
                  <li>기타 서비스 운영을 방해하는 행위가 확인된 경우</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">제4조 (서비스의 제공)</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>회사는 유휴자산 등록, 구매 요청, 매칭 중개 서비스를 제공합니다.</li>
              <li>회사는 거래의 당사자가 아니며, 거래의 성사·이행·품질을 보증하지 않습니다.</li>
              <li>서비스는 시스템 점검 등의 사유로 일시 중단될 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">제5조 (이용자의 의무)</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>이용자는 정확한 정보를 등록하고 변경 사항을 최신으로 유지해야 합니다.</li>
              <li>타인의 계정을 사용하거나, 서비스를 부정하게 이용해서는 안 됩니다.</li>
              <li>등록한 자산 정보의 정확성에 대한 책임은 이용자에게 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">제6조 (계약 해지 및 이용 제한)</h2>
            <p className="text-slate-600 leading-relaxed">
              이용자는 언제든지 회원 탈퇴를 요청할 수 있으며, 회사는 본 약관을 위반한 이용자에 대해
              서비스 이용을 제한하거나 계약을 해지할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">제7조 (면책조항)</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>회사는 이용자 간 거래에서 발생하는 분쟁에 대해 책임을 지지 않습니다.</li>
              <li>천재지변, 시스템 장애 등 불가항력적 사유로 인한 손해에 대해 책임을 지지 않습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">제8조 (분쟁 해결)</h2>
            <p className="text-slate-600 leading-relaxed">
              본 약관에 관한 분쟁은 대한민국 법률에 따르며, 회사 소재지 관할 법원을 전속 관할 법원으로 합니다.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
          <span className="text-xs text-slate-300">ROOT</span>
          <Link href="/privacy" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            개인정보처리방침
          </Link>
        </div>
      </footer>
    </div>
  );
}
