"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  maxCount?: number;
}

export default function ImageUploader({ value, onChange, maxCount = 4 }: Props) {
  const [uploading, setUploading] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const MAX_SIZE_MB = 30;

  async function handleFile(index: number, file: File) {
    if (!file.type.startsWith("image/")) { alert("이미지 파일만 업로드 가능합니다."); return; }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) { alert(`이미지 크기는 ${MAX_SIZE_MB}MB 이하여야 합니다.`); return; }
    setUploading(index);
    try {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("assets-images")
        .upload(path, file, { upsert: false });

      if (error) throw error;

      const { data } = supabase.storage.from("assets-images").getPublicUrl(path);

      const next = [...value];
      next[index] = data.publicUrl;
      onChange(next);
    } catch (e) {
      alert("업로드 실패: " + (e as Error).message);
    } finally {
      setUploading(null);
    }
  }

  async function handleRemove(index: number) {
    const url = value[index];
    if (url) {
      const path = url.split("/assets-images/")[1];
      if (path) await supabase.storage.from("assets-images").remove([path]);
    }
    const next = [...value];
    next[index] = "";
    onChange(next);
    if (inputRefs.current[index]) inputRefs.current[index]!.value = "";
  }

  function handleDrop(index: number, e: React.DragEvent) {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files?.[0];
    if (file && !value[index]) handleFile(index, file);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        사진 (최대 {maxCount}장)
      </label>
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: maxCount }).map((_, i) => {
          const url = value[i];
          return (
            <div key={i} className="relative aspect-square">
              {url ? (
                <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`이미지 ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemove(i)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black/70"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label
                  className={`flex flex-col items-center justify-center w-full h-full rounded-lg border-2 border-dashed cursor-pointer transition-colors
                    ${uploading === i ? "opacity-50 pointer-events-none border-gray-300" : ""}
                    ${dragOver === i ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"}
                  `}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(i); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => handleDrop(i, e)}
                >
                  {uploading === i ? (
                    <span className="text-xs text-gray-400">업로드 중...</span>
                  ) : (
                    <>
                      <span className="text-2xl text-gray-300">{dragOver === i ? "↓" : "+"}</span>
                      <span className="text-xs text-gray-400 mt-1 text-center px-1">
                        {dragOver === i ? "여기에 놓기" : "클릭 또는 드래그"}
                      </span>
                    </>
                  )}
                  <input
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(i, file);
                    }}
                  />
                </label>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
