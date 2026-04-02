"use client";

import Link from "next/link";
import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

// 지게차 아이소메트릭 일러스트
function ForkliftIllustration() {
  return (
    <svg viewBox="0 0 420 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md">
      {/* 그림자 */}
      <ellipse cx="210" cy="295" rx="160" ry="14" fill="#0A1628" opacity="0.15"/>

      {/* 선반 */}
      <rect x="280" y="60" width="110" height="8" rx="2" fill="#F97316"/>
      <rect x="280" y="110" width="110" height="8" rx="2" fill="#F97316"/>
      <rect x="280" y="160" width="110" height="8" rx="2" fill="#F97316"/>
      <rect x="278" y="60" width="7" height="160" rx="2" fill="#1e3a5f"/>
      <rect x="383" y="60" width="7" height="160" rx="2" fill="#1e3a5f"/>

      {/* 선반 위 박스들 */}
      <rect x="288" y="36" width="35" height="26" rx="3" fill="#1e3a5f"/>
      <rect x="288" y="36" width="35" height="8" rx="3" fill="#0A1628"/>
      <line x1="305" y1="36" x2="305" y2="62" stroke="#0A1628" strokeWidth="1.5" opacity="0.5"/>
      <rect x="330" y="40" width="30" height="22" rx="3" fill="#2d5a8e"/>
      <rect x="330" y="40" width="30" height="7" rx="3" fill="#1e3a5f"/>

      <rect x="288" y="88" width="38" height="24" rx="3" fill="#F97316"/>
      <rect x="288" y="88" width="38" height="7" rx="3" fill="#c2500a"/>
      <line x1="307" y1="88" x2="307" y2="112" stroke="#c2500a" strokeWidth="1.5" opacity="0.5"/>
      <rect x="332" y="91" width="32" height="21" rx="3" fill="#1e3a5f"/>

      <rect x="288" y="138" width="33" height="24" rx="3" fill="#2d5a8e"/>
      <rect x="330" y="141" width="28" height="21" rx="3" fill="#F97316" opacity="0.8"/>

      {/* 지게차 본체 */}
      <rect x="50" y="170" width="115" height="75" rx="8" fill="#1e3a5f"/>
      <rect x="50" y="170" width="115" height="28" rx="8" fill="#2d5a8e"/>
      {/* 캐빈 유리 */}
      <rect x="65" y="178" width="42" height="18" rx="3" fill="#7dd3fc" opacity="0.6"/>
      {/* 지붕 보호대 */}
      <rect x="48" y="165" width="119" height="8" rx="3" fill="#0A1628"/>
      <rect x="55" y="155" width="4" height="20" rx="2" fill="#0A1628"/>
      <rect x="157" y="155" width="4" height="20" rx="2" fill="#0A1628"/>
      <rect x="48" y="153" width="119" height="6" rx="3" fill="#1e3a5f"/>

      {/* 마스트 */}
      <rect x="160" y="100" width="9" height="145" rx="3" fill="#0A1628"/>
      <rect x="172" y="100" width="9" height="145" rx="3" fill="#0A1628"/>
      {/* 포크 */}
      <rect x="160" y="148" width="80" height="9" rx="2" fill="#F97316"/>
      <rect x="160" y="162" width="80" height="9" rx="2" fill="#F97316"/>

      {/* 포크 위 박스 */}
      <rect x="175" y="112" width="55" height="42" rx="4" fill="#F97316"/>
      <rect x="175" y="112" width="55" height="12" rx="4" fill="#c2500a"/>
      <line x1="202" y1="112" x2="202" y2="154" stroke="#c2500a" strokeWidth="1.5" opacity="0.6"/>

      {/* 바퀴 */}
      <circle cx="85" cy="252" r="22" fill="#0A1628"/>
      <circle cx="85" cy="252" r="13" fill="#1e3a5f"/>
      <circle cx="85" cy="252" r="5" fill="#2d5a8e"/>
      <circle cx="145" cy="252" r="22" fill="#0A1628"/>
      <circle cx="145" cy="252" r="13" fill="#1e3a5f"/>
      <circle cx="145" cy="252" r="5" fill="#2d5a8e"/>

      {/* 카운터웨이트 */}
      <rect x="50" y="220" width="30" height="35" rx="4" fill="#0A1628"/>

      {/* 배기통 */}
      <rect x="148" y="160" width="8" height="20" rx="2" fill="#0A1628"/>

      {/* 바닥선 */}
      <line x1="30" y1="274" x2="390" y2="274" stroke="#1e3a5f" strokeWidth="2" opacity="0.3"/>
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A1628] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl font-black text-white tracking-tighter">ROOT</span>
            <span className="hidden sm:block text-xs text-white/40 font-medium border border-white/20 px-2 py-0.5 rounded">물류 유휴자산 B2B</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="text-sm text-white/60 hover:text-white font-medium transition-colors">
              로그인
            </Link>
            <Link href="/register" className="text-sm bg-orange-500 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-bold hover:bg-orange-400 transition-colors whitespace-nowrap">
              무료 시작
            </Link>
          </div>
        </div>
      </header>

      {/* 히어로 */}
      <section className="bg-[#0A1628] pt-20 min-h-[90vh] flex items-center relative overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
              유휴 장비 매칭 플랫폼
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5 tracking-tight">
              쓰지 않는<br />장비를<br /><span className="text-orange-400">수익으로.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-sm sm:text-base text-white/50 leading-relaxed mb-8 max-w-md">
              지게차, 컨베이어, 제함기 등 창고에 방치된 물류 장비를 등록하면,
              ROOT가 필요한 기업과 직접 연결해드립니다.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link href="/register" className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-colors">
                장비 등록하기 →
              </Link>
              <Link href="/login" className="text-white/50 hover:text-white text-sm font-medium transition-colors px-2 py-3.5">
                이미 계정이 있어요
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
          >
            <ForkliftIllustration />
          </motion.div>
        </div>

        {/* 하단 웨이브 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* 통계 */}
      <section className="bg-white pt-2 pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <Section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { number: "100+", label: "거래 완료 장비", icon: "📦" },
              { number: "7일", label: "평균 매칭 기간", icon: "⚡" },
              { number: "1:1", label: "전담 매니저 배정", icon: "🤝" },
              { number: "무료", label: "가입 및 등록", icon: "✓" },
            ].map((item) => (
              <motion.div key={item.label} variants={fadeUp}
                className="border border-gray-100 rounded-2xl p-5 sm:p-6 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50 transition-all duration-300">
                <p className="text-2xl mb-1">{item.icon}</p>
                <p className="text-2xl sm:text-3xl font-black text-[#0A1628] mb-1">{item.number}</p>
                <p className="text-xs text-gray-400 font-medium">{item.label}</p>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#0A1628] py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <Section>
            <motion.div variants={fadeUp} className="mb-12 sm:mb-16">
              <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-3">How it works</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">3단계로 거래가<br className="sm:hidden" /> 완료됩니다.</h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  step: "01", title: "장비 등록",
                  desc: "보유 중인 유휴 장비 정보를 등록해드립니다.",
                  icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
                },
                {
                  step: "02", title: "매니저 매칭",
                  desc: "ROOT 매니저가 최적의 거래처를 직접 찾아 연결해드립니다.",
                  icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                },
                {
                  step: "03", title: "거래 완료",
                  desc: "협상부터 계약까지 ROOT가 함께 진행해드립니다.",
                  icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                },
              ].map((item, i) => (
                <motion.div key={item.step} variants={fadeUp}
                  className="relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-orange-500/30 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-orange-400 font-black text-xs">STEP {item.step}</span>
                    {i < 2 && <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-white/20 text-lg">→</div>}
                  </div>
                  <div className="w-11 h-11 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center text-orange-400 mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* 대상 */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <Section>
            <motion.div variants={fadeUp} className="mb-10 sm:mb-14">
              <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-3">For who</p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A1628] tracking-tight">이런 분께 맞습니다.</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div variants={fadeUp}
                className="bg-[#0A1628] rounded-2xl p-8 sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center mb-6 text-2xl">
                    🏭
                  </div>
                  <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-3">판매자</p>
                  <h3 className="text-xl font-bold text-white mb-5 leading-snug">쓰지 않는 장비가<br />창고를 차지하고 있다면.</h3>
                  <ul className="space-y-3">
                    {["창고·공장 이전 후 남은 지게차, 컨베이어, 제함기 등", "신규 장비로 교체 예정이라 처분이 필요한 경우", "보관 비용은 나가는데 가져갈 곳을 못 찾은 경우"].map((t) => (
                      <li key={t} className="flex items-start gap-3 text-sm text-white/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 mt-2" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
              <motion.div variants={fadeUp}
                className="border-2 border-gray-100 rounded-2xl p-8 sm:p-10 relative overflow-hidden hover:border-orange-100 transition-colors">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6 text-2xl">
                  🚚
                </div>
                <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-3">구매자</p>
                <h3 className="text-xl font-bold text-[#0A1628] mb-5 leading-snug">장비가 급하게 필요한데<br />신품 납기는 너무 길다면.</h3>
                <ul className="space-y-3">
                  {["현장 투입이 급해 빠른 수급이 필요한 경우", "신품 대비 예산을 줄여야 하는 중소 물류사", "특정 사양의 장비를 어디서 구해야 할지 모르는 경우"].map((t) => (
                    <li key={t} className="flex items-start gap-3 text-sm text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 mt-2" />
                      {t}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </Section>
        </div>
      </section>

      {/* 부가 서비스 */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            <Section className="flex-1">
              <motion.p variants={fadeUp} className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-3">Additional Service</motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-black text-[#0A1628] tracking-tight leading-tight mb-4">
                장비 처분 이후도<br />ROOT가 함께합니다.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-gray-400 text-sm leading-relaxed mb-2">
                물류센터 운영을 종료할 때 장비 처분 이후에도 해결해야 할 일이 많습니다.
                ROOT는 신뢰할 수 있는 업체를 직접 연결해드립니다.
              </motion.p>
              <motion.p variants={fadeUp} className="text-xs text-gray-300 font-medium">※ 현재 수도권 한정 운영</motion.p>
            </Section>
            <Section className="flex-1 w-full space-y-3">
              {[
                { title: "철거 · 해체", desc: "물류센터 내 설비·구조물 철거 및 해체 업체를 매칭해드립니다.", icon: "🔧" },
                { title: "전기공사", desc: "배선 정리, 분전반 철거 등 전기 관련 공사 업체를 연결해드립니다.", icon: "⚡" },
                { title: "원상복구", desc: "임차 종료 시 필요한 원상복구 시공 상담 및 업체 매칭을 도와드립니다.", icon: "🏗️" },
              ].map((item) => (
                <motion.div key={item.title} variants={fadeUp}
                  className="flex items-start gap-4 bg-white border border-gray-200 rounded-2xl p-5 hover:border-orange-200 hover:shadow-md transition-all duration-300">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-bold text-[#0A1628] text-sm mb-0.5">{item.title}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </Section>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 relative overflow-hidden" style={{ backgroundColor: "#0A1628" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <Section className="relative max-w-3xl mx-auto px-4 sm:px-8 text-center">
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-5xl font-black text-orange-500 mb-4 tracking-tight leading-tight">
            장비 처분,<br />고민하지 마세요.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/70 mb-8 text-base">등록은 무료입니다. 매칭은 ROOT가 합니다.</motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="w-full sm:w-auto bg-white text-orange-500 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-orange-50 transition-colors">
              무료로 시작하기 →
            </Link>
            <Link href="/login" className="w-full sm:w-auto text-white/60 hover:text-white text-sm font-medium transition-colors py-3.5">
              이미 계정이 있어요
            </Link>
          </motion.div>
        </Section>
      </section>

      {/* 푸터 */}
      <footer className="bg-[#0A1628] border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xl font-black text-white tracking-tighter">ROOT</span>
          <p className="text-xs text-white/20">Copyright © ROOT. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
