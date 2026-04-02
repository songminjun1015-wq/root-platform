"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ImageUploader from "@/app/_components/ImageUploader";

const SERVICE_OPTIONS = [
  { value: "AS_AVAILABLE",           label: "A/S 가능" },
  { value: "LOADING_AVAILABLE",      label: "상차도 가능" },
  { value: "INSTALLATION_AVAILABLE", label: "설치 가능" },
  { value: "TEST_RUN_AVAILABLE",     label: "시운전 가능" },
  { value: "INSTALLMENT_AVAILABLE",  label: "할부 가능" },
];

interface Form {
  assetTitle: string;
  category: string;
  manufacturer: string;
  modelName: string;
  quantity: string;
  conditionGrade: string;
  locationRegion: string;
  askingPrice: string;
  priceNegotiable: boolean;
  description: string;
  imageUrls: string[];
  manufacturedYear: string;
  manufacturedMonth: string;
  purchasedAt: string;
  purchasedFrom: string;
  purchasePrice: string;
  serviceOptions: string[];
}

export default function AssetEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/assets/${id}`).then((r) => r.json()).then((json) => {
      if (!json.asset) { setError("자산을 불러올 수 없습니다."); return; }
      const a = json.asset;
      setForm({
        assetTitle:       a.assetTitle,
        category:         a.category,
        manufacturer:     a.manufacturer ?? "",
        modelName:        a.modelName ?? "",
        quantity:         String(a.quantity),
        conditionGrade:   a.conditionGrade,
        locationRegion:   a.locationRegion,
        askingPrice:      a.askingPrice ?? "",
        priceNegotiable:  a.priceNegotiable,
        description:      a.description ?? "",
        imageUrls:        a.imageUrls ?? [],
        manufacturedYear:  a.manufacturedYear ? String(a.manufacturedYear) : "",
        manufacturedMonth: a.manufacturedMonth ? String(a.manufacturedMonth) : "",
        purchasedAt:      a.purchasedAt ? a.purchasedAt.slice(0, 10) : "",
        purchasedFrom:    a.purchasedFrom ?? "",
        purchasePrice:    a.purchasePrice ?? "",
        serviceOptions:   a.serviceOptions ?? [],
      });
    });
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const target = e.target as HTMLInputElement;
    setForm((prev) => prev ? {
      ...prev,
      [target.name]: target.type === "checkbox" ? target.checked : target.value,
    } : prev);
  }

  function toggleOption(value: string) {
    setForm((prev) => {
      if (!prev) return prev;
      const opts = prev.serviceOptions.includes(value)
        ? prev.serviceOptions.filter((v) => v !== value)
        : [...prev.serviceOptions, value];
      return { ...prev, serviceOptions: opts };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setError(""); setLoading(true);
    try {
      const res = await fetch(`/api/assets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetTitle:      form.assetTitle,
          category:        form.category,
          manufacturer:    form.manufacturer || null,
          modelName:       form.modelName || null,
          quantity:        Number(form.quantity),
          conditionGrade:  form.conditionGrade,
          locationRegion:  form.locationRegion,
          askingPrice:     form.askingPrice ? Number(form.askingPrice) : null,
          priceNegotiable: form.priceNegotiable,
          description:     form.description || null,
          imageUrls:       form.imageUrls.filter(Boolean),
          manufacturedYear:  form.manufacturedYear ? Number(form.manufacturedYear) : null,
          manufacturedMonth: form.manufacturedMonth ? Number(form.manufacturedMonth) : null,
          purchasedAt:     form.purchasedAt || null,
          purchasedFrom:   form.purchasedFrom || null,
          purchasePrice:   form.purchasePrice ? Number(form.purchasePrice) : null,
          serviceOptions:  form.serviceOptions,
        }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "수정 실패"); return; }
      router.push(`/assets/${id}`);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  if (!form) return (
    <div className="p-8 max-w-2xl mx-auto">
      {error ? <p className="text-red-600 text-sm">{error}</p> : <p className="text-slate-400 text-sm">불러오는 중...</p>}
    </div>
  );

  return (
    <div className="p-6 sm:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/assets" className="hover:text-slate-600">자산 관리</Link>
        <span>/</span>
        <Link href={`/assets/${id}`} className="hover:text-slate-600">상세</Link>
        <span>/</span>
        <span className="text-slate-600">수정</span>
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">자산 수정</h1>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── 기본 정보 ── */}
        <EditSection title="기본 정보">
          <Field label="자산명 *">
            <input name="assetTitle" value={form.assetTitle} onChange={handleChange} required className={input} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="카테고리 *">
              <input name="category" value={form.category} onChange={handleChange} required className={input} />
            </Field>
            <Field label="제조사">
              <input name="manufacturer" value={form.manufacturer} onChange={handleChange} className={input} />
            </Field>
          </div>
          <Field label="모델명">
            <input name="modelName" value={form.modelName} onChange={handleChange} className={input} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="수량 *">
              <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} required className={input} />
            </Field>
            <Field label="상태등급 *">
              <select name="conditionGrade" value={form.conditionGrade} onChange={handleChange} required className={input}>
                <option value="">선택</option>
                <option value="A">A — 최상</option>
                <option value="B">B — 양호</option>
                <option value="C">C — 보통</option>
                <option value="D">D — 부품용</option>
              </select>
            </Field>
          </div>
          <Field label="지역 *">
            <input name="locationRegion" value={form.locationRegion} onChange={handleChange} required className={input} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="희망가 (원)">
              <input name="askingPrice" type="number" min="0" value={form.askingPrice} onChange={handleChange} className={input} />
            </Field>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input name="priceNegotiable" type="checkbox" checked={form.priceNegotiable} onChange={handleChange}
                  className="rounded border-slate-300 text-orange-500" />
                가격 협의 가능
              </label>
            </div>
          </div>
        </EditSection>

        {/* ── 장비 이력 ── */}
        <EditSection title="장비 이력">
          <div className="grid grid-cols-2 gap-4">
            <Field label="제조연도">
              <select name="manufacturedYear" value={form.manufacturedYear} onChange={handleChange} className={input}>
                <option value="">선택</option>
                {Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <option key={y} value={y}>{y}년</option>
                ))}
              </select>
            </Field>
            <Field label="제조월">
              <select name="manufacturedMonth" value={form.manufacturedMonth} onChange={handleChange} className={input}>
                <option value="">선택</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{m}월</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="구매일자">
            <input name="purchasedAt" type="date" value={form.purchasedAt} onChange={handleChange} className={input} />
          </Field>
          <Field label="구매처">
            <input name="purchasedFrom" value={form.purchasedFrom} onChange={handleChange} className={input} />
          </Field>
          <Field label="구매금액 (원)">
            <input name="purchasePrice" type="number" min="0" value={form.purchasePrice} onChange={handleChange} className={input} />
          </Field>
          <p className="text-xs text-slate-400">※ 구매금액은 본인과 운영자만 확인할 수 있습니다.</p>
        </EditSection>

        {/* ── 서비스 옵션 ── */}
        <EditSection title="서비스 옵션">
          <p className="text-xs text-slate-400 -mt-1 mb-3">제공 가능한 서비스를 모두 선택하세요.</p>
          <div className="flex flex-wrap gap-2">
            {SERVICE_OPTIONS.map((opt) => {
              const active = form.serviceOptions.includes(opt.value);
              return (
                <button key={opt.value} type="button" onClick={() => toggleOption(opt.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    active
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-slate-600 border-slate-200 hover:border-orange-300"
                  }`}>
                  {active ? "✓ " : ""}{opt.label}
                </button>
              );
            })}
          </div>
        </EditSection>

        {/* ── 사진 / 설명 ── */}
        <EditSection title="사진 및 설명">
          <ImageUploader
            value={form.imageUrls}
            onChange={(urls) => setForm((prev) => prev ? { ...prev, imageUrls: urls } : prev)}
          />
          <Field label="설명">
            <textarea name="description" value={form.description} onChange={handleChange} rows={4}
              className={`${input} resize-none`} />
          </Field>
        </EditSection>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="bg-orange-500 hover:bg-orange-400 text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors">
            {loading ? "저장 중..." : "저장하기"}
          </button>
          <Link href={`/assets/${id}`}
            className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}

const input = "w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent";

function EditSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
      <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
