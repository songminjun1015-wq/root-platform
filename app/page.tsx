import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-2xl font-black text-slate-900 tracking-tighter">ROOT</span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-500 hover:text-slate-900 font-medium transition-colors">
              로그인
            </Link>
            <Link href="/register" className="text-sm bg-slate-900 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-slate-700 transition-colors">
              무료 시작
            </Link>
          </div>
        </div>
      </header>

      {/* 히어로 */}
      <section className="relative min-h-screen bg-white flex items-center pt-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-slate-100 rounded-full blur-2xl opacity-50" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 pt-12 pb-32 w-full text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-4 py-2 rounded-full mb-10">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            물류 유휴자산 B2B 플랫폼
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.05] mb-8 tracking-tight">
            쓰지 않는<br />
            장비를<br />
            <span className="text-indigo-600">수익으로.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-xl mx-auto mb-12 leading-relaxed">
            지게차, 컨베이어, 제함기 등 창고에 방치된 물류 장비를 등록하면,
            ROOT가 필요한 기업과 직접 연결해드립니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/register?type=seller" className="w-full sm:w-auto bg-indigo-700 hover:bg-indigo-800 text-white px-10 py-4 rounded-xl font-bold text-sm transition-colors text-center shadow-lg shadow-indigo-100">
              장비 판매하기 →
            </Link>
            <Link href="/register?type=buyer" className="w-full sm:w-auto bg-white text-slate-800 border border-gray-200 px-10 py-4 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors text-center">
              장비 구매하기
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-300 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </section>

      {/* 실적 띠 */}
      <section className="bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
            {[
              { number: "100+", label: "거래 완료 장비" },
              { number: "평균 7일", label: "매칭 소요 기간" },
              { number: "1:1", label: "전담 매니저 배정" },
              { number: "무료", label: "가입 및 등록" },
            ].map((item) => (
              <div key={item.label} className="py-2">
                <p className="text-3xl font-black text-white mb-1.5">{item.number}</p>
                <p className="text-sm text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <div className="text-center mb-20">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">How it works</p>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">3단계로 거래가 완료됩니다.</h2>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="hidden md:block absolute top-12 left-[33%] right-[33%] h-px border-t-2 border-dashed border-indigo-100" />
          {[
            {
              step: "01", title: "장비 등록",
              desc: "보유 장비의 위치, 상태, 수량, 희망가를 입력합니다. 사진도 올릴 수 있어요.",
              icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
            },
            {
              step: "02", title: "매니저 매칭",
              desc: "ROOT 매니저가 구매 요청과 비교해 최적의 연결을 직접 제안합니다.",
              icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
            },
            {
              step: "03", title: "거래 완료",
              desc: "협상부터 계약까지 진행 상황을 플랫폼에서 실시간으로 확인합니다.",
              icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            },
          ].map((item) => (
            <div key={item.step} className="relative flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6 text-indigo-600 shadow-sm group-hover:-translate-y-1 transition-transform">
                {item.icon}
              </div>
              <span className="text-xs font-black text-indigo-400 mb-3">STEP {item.step}</span>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 대상 */}
      <section className="bg-slate-50 border-y border-slate-100 py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">For who</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">이런 분께 맞습니다.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative bg-white border border-slate-200 rounded-3xl p-10 overflow-hidden group hover:border-indigo-200 hover:shadow-lg transition-all">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                </div>
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">Seller · 판매자</p>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 leading-snug">쓰지 않는 장비가<br />창고를 차지하고 있다면.</h3>
                <ul className="space-y-4">
                  {["창고·공장 이전 후 남은 지게차, 컨베이어, 제함기 등", "신규 장비로 교체 예정이라 처분이 필요한 경우", "보관 비용은 나가는데 가져갈 곳을 못 찾은 경우"].map((t) => (
                    <li key={t} className="flex items-start gap-3 text-sm text-gray-500">
                      <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative bg-white border border-slate-200 rounded-3xl p-10 overflow-hidden group hover:border-emerald-200 hover:shadow-lg transition-all">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4">Buyer · 구매자</p>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 leading-snug">장비가 급하게 필요한데<br />신품 납기는 너무 길다면.</h3>
                <ul className="space-y-4">
                  {["현장 투입이 급해 빠른 수급이 필요한 경우", "신품 대비 예산을 줄여야 하는 중소 물류사", "특정 사양의 장비를 어디서 구해야 할지 모르는 경우"].map((t) => (
                    <li key={t} className="flex items-start gap-3 text-sm text-gray-500">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 부가 서비스 */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">Additional Service</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight mb-5">
              장비 처분 이후도<br />ROOT가 함께합니다.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-3">
              물류센터 운영을 종료할 때 장비 처분 이후에도 해결해야 할 일이 많습니다.
              ROOT는 신뢰할 수 있는 업체를 직접 연결해드립니다.
            </p>
            <p className="text-xs text-slate-400 font-medium">※ 현재 수도권 한정 운영</p>
          </div>
          <div className="flex-1 w-full grid grid-cols-1 gap-4">
            {[
              {
                icon: <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
                title: "철거 · 해체", desc: "물류센터 내 설비·구조물 철거 및 해체 업체를 매칭해드립니다.",
              },
              {
                icon: <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                title: "전기공사", desc: "배선 정리, 분전반 철거 등 전기 관련 공사 업체를 연결해드립니다.",
              },
              {
                icon: <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
                title: "원상복구", desc: "임차 종료 시 필요한 원상복구 시공 상담 및 업체 매칭을 도와드립니다.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm mb-1">{item.title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 후기 */}
      <section className="bg-slate-50 border-y border-slate-100 py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">Reviews</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">실제 거래 후기입니다.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { role: "판매자", region: "경기도", field: "물류 운영", color: "indigo",
                review: "창고 이전하면서 지게차 2대를 어떻게 처리할지 막막했는데, ROOT에 올리고 나서 따로 연락할 필요가 없었어요. 매니저분이 다 알아서 해주시고 저는 서류만 챙겼습니다." },
              { role: "판매자", region: "인천", field: "장비 임대·매각", color: "indigo",
                review: "중고나라 같은 데는 개인 연락이 너무 많아서 지쳤는데, 여기는 기업 상대로만 진행되니까 훨씬 편했어요. 처분을 깔끔하게 마무리했습니다." },
              { role: "구매자", region: "경기도", field: "물류센터 운영", color: "emerald",
                review: "지게차가 갑자기 필요해졌는데 신품은 납기가 두 달이라 안 됐어요. 요청 올렸더니 사흘 만에 맞는 장비 연결해줬고, 직접 보고 나서 바로 진행했습니다." },
              { role: "구매자", region: "부산", field: "물류센터 시설", color: "emerald",
                review: "센터 오픈 준비하면서 컨베이어가 필요했는데 예산이 빠듯했어요. 운영자가 스펙 맞는 걸 직접 골라줘서 고민 없이 진행할 수 있었습니다." },
            ].map((item, i) => (
              <div key={i} className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className={`absolute top-0 left-0 w-1.5 h-full rounded-l-3xl ${item.color === "indigo" ? "bg-indigo-600" : "bg-emerald-500"}`} />
                <div className="flex gap-0.5 mb-5 pl-4">
                  {[...Array(5)].map((_, j) => <span key={j} className="text-amber-400 text-base">★</span>)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-7 pl-4">{item.review}</p>
                <div className="flex items-center gap-3 pl-4 pt-5 border-t border-gray-100">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black ${item.color === "indigo" ? "bg-indigo-50 text-indigo-700" : "bg-emerald-50 text-emerald-700"}`}>
                    {item.role === "판매자" ? "S" : "B"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{item.field} · {item.region}</p>
                    <p className="text-xs text-gray-400">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-slate-900 py-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-indigo-700/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6">Get started</p>
          <h2 className="text-5xl font-black text-white mb-6 tracking-tight leading-tight">
            장비 처분,<br />고민하지 마세요.
          </h2>
          <p className="text-slate-400 mb-10 text-lg">등록은 무료입니다. 매칭은 ROOT가 합니다.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto bg-white text-slate-900 px-10 py-4 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg">
              무료로 시작하기 →
            </Link>
            <Link href="/login" className="w-full sm:w-auto text-slate-400 hover:text-white text-sm font-semibold transition-colors py-4">
              이미 계정이 있어요
            </Link>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-slate-900 border-t border-slate-800 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-2xl font-black text-white tracking-tighter">ROOT</span>
          <p className="text-xs text-slate-600">Copyright © ROOT. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
