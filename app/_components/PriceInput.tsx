"use client";

import { useState, useEffect } from "react";

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string | number;
  value?: string | number;
  onChange?: (raw: string) => void;
  max?: number;
  required?: boolean;
  className?: string;
}

function formatWithComma(raw: string): string {
  const num = raw.replace(/[^0-9]/g, "");
  if (!num) return "";
  return Number(num).toLocaleString("ko-KR");
}

export default function PriceInput({
  name, label, placeholder, defaultValue, value, onChange, max, required, className,
}: Props) {
  const controlled = value !== undefined;
  const initial = controlled ? String(value ?? "") : String(defaultValue ?? "");

  const [display, setDisplay] = useState(() => formatWithComma(initial.replace(/[^0-9]/g, "")));
  const [raw, setRaw] = useState(() => initial.replace(/[^0-9]/g, ""));

  // controlled 모드: 외부 value 변경 시 동기화
  useEffect(() => {
    if (controlled) {
      const r = String(value ?? "").replace(/[^0-9]/g, "");
      setRaw(r);
      setDisplay(formatWithComma(r));
    }
  }, [value, controlled]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const r = e.target.value.replace(/[^0-9]/g, "");
    if (max !== undefined && r && Number(r) > max) return;
    setRaw(r);
    setDisplay(formatWithComma(r));
    onChange?.(r);
  }

  const inputClass = className ?? "w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent";

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={inputClass}
        />
        {/* 폼 제출용 숨김 input */}
        <input type="hidden" name={name} value={raw} />
      </div>
      {display && (
        <p className="text-xs text-slate-400 mt-1">₩ {display} 원</p>
      )}
    </div>
  );
}
