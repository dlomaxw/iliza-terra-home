"use client";
import { useState } from "react";
import { ImagePlus } from "lucide-react";

export function ImagePicker({ name, multiple = true }: { name: string; multiple?: boolean }) {
  const [previews, setPreviews] = useState<string[]>([]);
  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-muted hover:border-sky hover:bg-sky-light">
        <ImagePlus className="h-8 w-8 text-sky" />
        <span><b className="text-navy">Click to upload</b> {multiple ? "one or more photos" : "a photo"} (JPG, PNG, WebP — resized automatically)</span>
        <input type="file" name={name} accept="image/*" multiple={multiple} className="sr-only"
          onChange={(e) => setPreviews(Array.from(e.target.files ?? []).map((f) => URL.createObjectURL(f)))} />
      </label>
      {previews.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {previews.map((p) => <img key={p} src={p} alt="" className="aspect-square w-full rounded-lg object-cover" />)}
        </div>
      )}
    </div>
  );
}
