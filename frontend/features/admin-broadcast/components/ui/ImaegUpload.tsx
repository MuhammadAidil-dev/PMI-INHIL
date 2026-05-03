'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ImagePlus, Upload } from 'lucide-react';

interface ImageUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    // Validasi tipe & ukuran
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file terlalu besar. Maksimal 2MB.');
      return;
    }

    onChange(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0] ?? null;
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
          Gambar Utama
        </h3>
        <ImagePlus size={18} className="text-gray-400" />
      </div>

      {/* Upload Area */}
      <div className="p-6">
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          className="group relative cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-rose-300 hover:bg-rose-50 transition-all text-center"
        >
          {/* Preview */}
          <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center relative">
            {preview ? (
              <>
                <Image
                  src={preview}
                  alt="Preview gambar"
                  fill
                  className="object-cover"
                />
                {/* Overlay hover */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                  <Upload size={24} className="text-white" />
                  <span className="text-white text-xs font-semibold">
                    Ganti Gambar
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-gray-400 group-hover:text-rose-400 transition-colors py-8">
                <Upload size={28} />
                <span className="text-xs font-semibold">
                  Klik atau drag &amp; drop gambar di sini
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400">
            Rekomendasi ukuran: 1200 × 675px. Maksimal 2MB (JPG/PNG/WEBP).
          </p>
        </div>

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
        />

        {/* File name indicator */}
        {value && (
          <p className="mt-2 text-xs text-gray-500 truncate text-center">
            {value.name}
          </p>
        )}
      </div>
    </div>
  );
}
