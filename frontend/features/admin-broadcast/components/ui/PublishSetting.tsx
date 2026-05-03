'use client';

import { NewsCategory } from '../../types/admin-berita-broadcast.type';

type PublishType = 'now' | 'draft';

interface PublishSettingsProps {
  category: NewsCategory | '';
  onCategoryChange: (val: NewsCategory | '') => void;
  publishType: PublishType;
  onPublishTypeChange: (val: PublishType) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const CATEGORY_OPTIONS: { value: NewsCategory; label: string }[] = [
  { value: 'Darurat', label: 'Tanggap Darurat' },
  { value: 'Edukasi', label: 'Edukasi Kesehatan' },
  { value: 'Kesehatan', label: 'Info Donor Darah' },
  { value: 'Informasi', label: 'Kegiatan PMI' },
];

const PUBLISH_OPTIONS: {
  value: PublishType;
  label: string;
  description: string;
}[] = [
  {
    value: 'now',
    label: 'Publikasikan Sekarang',
    description: 'Berita akan segera muncul di feed publik.',
  },
  {
    value: 'draft',
    label: 'Simpan sebagai Draft',
    description: 'Hanya admin yang dapat melihat konten ini.',
  },
];

export default function PublishSettings({
  category,
  onCategoryChange,
  publishType,
  onPublishTypeChange,
  onSubmit,
  isSubmitting,
}: PublishSettingsProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
          Pengaturan
        </h3>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* Kategori */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="category"
            className="text-[11px] font-bold text-gray-700 uppercase tracking-wider"
          >
            Kategori
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) =>
              onCategoryChange(e.target.value as NewsCategory | '')
            }
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
          >
            <option value="">Pilih Kategori</option>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Opsi Publikasi */}
        <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
          <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
            Opsi Publikasi
          </label>
          <div className="flex flex-col gap-2">
            {PUBLISH_OPTIONS.map((opt) => {
              const isSelected = publishType === opt.value;
              return (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-rose-200 bg-rose-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="publish_type"
                    value={opt.value}
                    checked={isSelected}
                    onChange={() => onPublishTypeChange(opt.value)}
                    className="mt-0.5 text-rose-600 focus:ring-rose-300 h-4 w-4 border-gray-300"
                  />
                  <div>
                    <span
                      className={`block text-sm font-semibold ${
                        isSelected ? 'text-rose-800' : 'text-gray-800'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span
                      className={`text-xs ${
                        isSelected ? 'text-rose-500' : 'text-gray-400'
                      }`}
                    >
                      {opt.description}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full bg-rose-600 text-white py-3 rounded-lg text-sm font-bold shadow hover:bg-rose-700 hover:shadow-rose-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? 'Menyimpan...'
            : publishType === 'now'
              ? 'Konfirmasi & Publikasikan'
              : 'Simpan sebagai Draft'}
        </button>
      </div>
    </div>
  );
}
