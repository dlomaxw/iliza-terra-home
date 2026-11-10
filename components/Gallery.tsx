"use client";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyImage } from "./PropertyImage";

export function Gallery({ images, title, category }: { images: string[]; title: string; category: string }) {
  const [i, setI] = useState(0);
  if (!images.length) return <div className="relative aspect-[16/9] overflow-hidden rounded-2xl"><PropertyImage alt={title} category={category} /></div>;
  const go = (d: number) => setI((i + d + images.length) % images.length);
  return (
    <div>
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100">
        <Image src={images[i]} alt={`${title} — photo ${i + 1}`} fill priority={i === 0} sizes="(max-width:1024px) 100vw, 66vw" className="object-cover" />
        {images.length > 1 && (
          <>
            <button onClick={() => go(-1)} aria-label="Previous photo" className="absolute top-1/2 left-3 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy shadow hover:bg-white"><ChevronLeft /></button>
            <button onClick={() => go(1)} aria-label="Next photo" className="absolute top-1/2 right-3 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy shadow hover:bg-white"><ChevronRight /></button>
            <span className="absolute right-3 bottom-3 rounded-full bg-navy/80 px-3 py-1 text-xs text-white">{i + 1} / {images.length}</span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {images.map((src, k) => (
            <button key={src + k} onClick={() => setI(k)} aria-label={`Show photo ${k + 1}`}
              className={`relative aspect-[4/3] overflow-hidden rounded-lg ring-2 ${k === i ? "ring-orange" : "ring-transparent opacity-75 hover:opacity-100"}`}>
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
