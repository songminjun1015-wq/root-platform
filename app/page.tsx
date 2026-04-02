"use client";

import Link from "next/link";
import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-indigo-700 tracking-tighter">ROOT</span>
            <span className="text-sm text-gray-400 font-medium">물류 유휴자산 B2B 플랫폼</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-500 hover:text-slate-900 font-medium transition-colors">
              로그인
            </Link>
            <Link href="/register" className="text-sm bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-800 transition-colors">
              무료 시작
            </Link>
          </div>
        </div>
      </header>

      {/* 히어로 */}
      <section className="pt-20 bg-white">
        <div className="max-w-6xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.h1 variants={fadeUp} className="text-5xl font-black text-indigo-700 leading-tight mb-5 tracking-tight">
              쓰지 않는 장비를<br />수익으로.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-base text-gray-500 leading-relaxed mb-8 max-w-md">
              지게차, 컨베이어, 제함기 등 창고에 방치된 물류 장비를 등록하면,<br />
              ROOT가 필요한 기업과 직접 연결해드립니다.
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <Link href="/register" className="bg-indigo-700 hover:bg-indigo-800 text-white px-8 py-3 rounded-lg font-bold text-sm transition-colors">
                장비 등록하기 →
              </Link>
              <Link href="/login" className="text-gray-500 hover:text-slate-900 text-sm font-medium transition-colors px-4 py-3">
                로그인
              </Link>
            </motion.div>
          </motion.div>

          {/* 일러스트 */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <svg viewBox="0 0 480 360" className="w-full max-w-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="240" cy="310" rx="200" ry="20" fill="#EEF2FF" />
              <rect x="160" y="200" width="240" height="30" rx="8" fill="#C7D2FE" />
              <rect x="160" y="200" width="240" height="8" rx="4" fill="#A5B4FC" />
              {[180,210,240,270,300,330,360].map((x, i) => (
                <rect key={i} x={x} y="200" width="4" height="30" fill="#818CF8" opacity="0.5" />
              ))}
              <circle cx="165" cy="215" r="10" fill="#818CF8" />
              <circle cx="395" cy="215" r="10" fill="#818CF8" />
              <rect x="270" y="160" width="50" height="40" rx="4" fill="#6366F1" />
              <rect x="270" y="160" width="50" height="12" rx="4" fill="#4F46E5" />
              <line x1="295" y1="160" x2="295" y2="200" stroke="#4F46E5" strokeWidth="1" />
              <rect x="200" y="165" width="45" height="35" rx="4" fill="#818CF8" />
              <rect x="200" y="165" width="45" height="10" rx="4" fill="#6366F1" />
              <line x1="222" y1="165" x2="222" y2="200" stroke="#6366F1" strokeWidth="1" />
              <rect x="340" y="168" width="40" height="32" rx="4" fill="#A5B4FC" />
              <rect x="340" y="168" width="40" height="9" rx="4" fill="#818CF8" />
              <rect x="60" y="180" width="100" height="70" rx="6" fill="#4F46E5" />
              <rect x="60" y="180" width="100" height="25" rx="6" fill="#6366F1" />
              <rect x="75" y="188" width="35" height="15" rx="3" fill="#C7D2FE" opacity="0.8" />
              <rect x="155" y="140" width="8" height="110" rx="3" fill="#3730A3" />
              <rect x="163" y="140" width="8" height="110" rx="3" fill="#3730A3" />
              <rect x="155" y="190" width="60" height="8" rx="2" fill="#312E81" />
              <rect x="155" y="202" width="60" height="8" rx="2" fill="#312E81" />
              <circle cx="90" cy="255" r="18" fill="#1E1B4B" />
              <circle cx="90" cy="255" r="10" fill="#3730A3" />
              <circle cx="140" cy="255" r="18" fill="#1E1B4B" />
              <circle cx="140" cy="255" r="10" fill="#3730A3" />
              <rect x="168" y="162" width="48" height="38" rx="4" fill="#6366F1" />
              <rect x="168" y="162" width="48" height="11" rx="4" fill="#4F46E5" />
              <rect x="380" y="120" width="80" height="6" rx="2" fill="#C7D2FE" />
              <rect x="380" y="160" width="80" height="6" rx="2" fill="#C7D2FE" />
              <rect x="380" y="200" width="80" height="6" rx="2" fill="#C7D2FE" />
              <rect x="378" y="120" width="6" height="140" rx="2" fill="#A5B4FC" />
              <rect x="456" y="120" width="6" height="140" rx="2" fill="#A5B4FC" />
              <rect x="386" y="100" width="28" height="22" rx="3" fill="#818CF8" />
              <rect x="420" y="103" width="26" height="19" rx="3" fill="#A5B4FC" />
              <rect x="386" y="140" width="30" height="22" rx="3" fill="#6366F1" />
              <rect x="420" y="143" width="25" height="19" rx="3" fill="#818CF8" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* 통계 */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-8 py-10">
          <Section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                number: "100+", label: "거래 완료 장비",
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
              },
              {
                number: "평균 7일", label: "매칭 소요 기간",
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              },
              {
                number: "1:1", label: "전담 매니저 배정",
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
              },
              {
                number: "무료", label: "가입 및 등록",
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
              },
            ].map((item) => (
              <motion.div key={item.label} variants={fadeUp} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xl font-black text-slate-900 leading-none mb-1">{item.number}</p>
                  <p className="text-xs text-gray-400">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-8 py-24">
        <Section>
          <motion.h2 variants={fadeUp} className="text-4xl font-black text-slate-900 text-center mb-14 tracking-tight">
            3단계로 거래가 완료됩니다.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "STEP 01", title: "장비 등록",
                desc: "지게차 장비 등록 정보를 등록해드립니다.",
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
              },
              {
                step: "STEP 02", title: "매니저 매칭",
                desc: "매니저 매칭 시기되는 매니저를 등록하면 연매드립니다.",
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
              },
              {
                step: "STEP 03", title: "거래 완료",
                desc: "거래처 장비 상가하고 거래 완료드립니다.",
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              },
            ].map((item, i) => (
              <motion.div key={item.step} variants={fadeUp} className="relative flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                {i < 2 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                )}
                <div className="w-11 h-11 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-indigo-500 mb-1">{item.step}</p>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      </section>

      {/* 대상 */}
      <section className="bg-gray-50 border-y border-gray-100 py-24">
        <div className="max-w-6xl mx-auto px-8">
          <Section>
            <motion.h2 variants={fadeUp} className="text-4xl font-black text-slate-900 text-center mb-12 tracking-tight">
              이런 분께 맞습니다.
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={fadeUp} className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-md transition-shadow duration-300">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-5">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                </div>
                <p className="text-xs font-bold text-indigo-600 mb-3">판매자</p>
                <h3 className="text-lg font-bold text-slate-900 mb-5 leading-snug">쓰지 않는 장비가<br />창고를 차지하고 있다면.</h3>
                <ul className="space-y-3">
                  {["창고·공장 이전 후 남은 지게차, 컨베이어, 제함기 등", "신규 장비로 교체 예정이라 처분이 필요한 경우", "보관 비용은 나가는데 가져갈 곳을 못 찾은 경우"].map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-sm text-gray-500">
                      <span className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div variants={fadeUp} className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-md transition-shadow duration-300">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-5">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <p className="text-xs font-bold text-blue-600 mb-3">구매자</p>
                <h3 className="text-lg font-bold text-slate-900 mb-5 leading-snug">장비가 급하게 필요한데<br />신품 납기는 너무 길다면.</h3>
                <ul className="space-y-3">
                  {["현장 투입이 급해 빠른 수급이 필요한 경우", "신품 대비 예산을 줄여야 하는 중소 물류사", "특정 사양의 장비를 어디서 구해야 할지 모르는 경우"].map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-sm text-gray-500">
                      <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      </span>
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
      <section className="max-w-6xl mx-auto px-8 py-24">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <Section className="flex-1">
            <motion.p variants={fadeUp} className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">Additional Service</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              장비 처분 이후도<br />ROOT가 함께합니다.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-sm leading-relaxed mb-2">
              물류센터 운영을 종료할 때 장비 처분 이후에도 해결해야 할 일이 많습니다.
              ROOT는 신뢰할 수 있는 업체를 직접 연결해드립니다.
            </motion.p>
            <motion.p variants={fadeUp} className="text-xs text-slate-400 font-medium">※ 현재 수도권 한정 운영</motion.p>
          </Section>
          <Section className="flex-1 w-full grid grid-cols-1 gap-3">
            {[
              { title: "철거 · 해체", desc: "물류센터 내 설비·구조물 철거 및 해체 업체를 매칭해드립니다." },
              { title: "전기공사", desc: "배선 정리, 분전반 철거 등 전기 관련 공사 업체를 연결해드립니다." },
              { title: "원상복구", desc: "임차 종료 시 필요한 원상복구 시공 상담 및 업체 매칭을 도와드립니다." },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeUp} className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-xl p-5 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors duration-300">
                <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm mb-0.5">{item.title}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-700 py-24">
        <Section className="max-w-3xl mx-auto px-8 text-center">
          <motion.h2 variants={fadeUp} className="text-4xl font-black text-white mb-4 tracking-tight leading-tight">
            장비 처분,<br />고민하지 마세요.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-indigo-200 mb-8 text-base">등록은 무료입니다. 매칭은 ROOT가 합니다.</motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="w-full sm:w-auto bg-white text-indigo-700 px-8 py-3 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors">
              무료로 시작하기 →
            </Link>
            <Link href="/login" className="w-full sm:w-auto text-indigo-200 hover:text-white text-sm font-semibold transition-colors py-3">
              이미 계정이 있어요
            </Link>
          </motion.div>
        </Section>
      </section>

      {/* 푸터 */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xl font-black text-white tracking-tighter">ROOT</span>
          <p className="text-xs text-slate-600">Copyright © ROOT. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
