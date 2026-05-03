import { Info, CheckCircle2 } from 'lucide-react';

const GUIDELINES = [
  'Pastikan NIK benar untuk integrasi database nasional.',
  'Masukkan nomor WhatsApp aktif untuk notifikasi kebutuhan darah.',
  'Golongan darah bersifat krusial, periksa kembali kartu donor lama jika ada.',
  'Berat badan minimal 45kg adalah syarat wajib pendonoran.',
];

export function DonorGuidelinesCard() {
  return (
    <div className="bg-red-50 border border-red-100 rounded-xl p-5">
      <h4 className="text-sm font-bold text-primary flex items-center gap-2 mb-3">
        <Info size={16} />
        Panduan Pendaftaran
      </h4>
      <ul className="space-y-2.5">
        {GUIDELINES.map((guide, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-xs text-neutral leading-relaxed"
          >
            <CheckCircle2
              size={14}
              className="text-primary shrink-0 mt-0.5"
              fill="currentColor"
              fillOpacity={0.15}
            />
            {guide}
          </li>
        ))}
      </ul>
    </div>
  );
}
