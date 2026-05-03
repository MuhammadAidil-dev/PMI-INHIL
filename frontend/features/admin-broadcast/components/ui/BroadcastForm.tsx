'use client';

import { useState } from 'react';
import { Send, Rocket } from 'lucide-react';
import {
  BroadcastPayload,
  BroadcastTarget,
} from '../../types/admin-berita-broadcast.type';

const TARGET_OPTIONS: { value: BroadcastTarget; label: string }[] = [
  { value: 'all', label: 'Semua Pendonor Terdaftar' },
  { value: 'golongan_a', label: 'Pendonor Golongan A' },
  { value: 'golongan_b', label: 'Pendonor Golongan B' },
  { value: 'golongan_ab', label: 'Pendonor Golongan AB' },
  { value: 'golongan_o', label: 'Pendonor Golongan O (Prioritas)' },
  { value: 'wilayah_custom', label: 'Donor Wilayah Tertentu' },
];

const ESTIMATED_REACH: Record<BroadcastTarget, string> = {
  all: '1.240',
  golongan_a: '310',
  golongan_b: '285',
  golongan_ab: '120',
  golongan_o: '525',
  wilayah_custom: '198',
};

interface BroadcastFormProps {
  onSubmit: (payload: BroadcastPayload) => Promise<void>;
}

export default function BroadcastForm({ onSubmit }: BroadcastFormProps) {
  const [target, setTarget] = useState<BroadcastTarget>('all');
  const [alertTitle, setAlertTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!alertTitle.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ target, alertTitle, message, isUrgent });
      // Reset form on success
      setAlertTitle('');
      setMessage('');
      setIsUrgent(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = !alertTitle.trim() || !message.trim() || isSubmitting;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 bg-rose-600 text-white rounded-t-xl flex items-center gap-2">
        <Send size={16} className="shrink-0" />
        <h3 className="text-sm font-bold uppercase tracking-wider">
          Kirim Notifikasi Massal
        </h3>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col gap-4">
        <p className="text-xs text-gray-400">
          Gunakan fitur ini untuk mengirimkan pesan darurat atau pengumuman
          penting secara instan ke seluruh pendonor aktif via WhatsApp.
        </p>

        {/* Target */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
            Target Penerima
          </label>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value as BroadcastTarget)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all bg-white"
          >
            {TARGET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Alert Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
            Judul Alert
          </label>
          <input
            type="text"
            value={alertTitle}
            onChange={(e) => setAlertTitle(e.target.value)}
            placeholder="Contoh: Darurat! Kebutuhan Darah Golongan O"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder:text-gray-300 focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
            Pesan Broadcast
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tulis pesan lengkap di sini..."
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder:text-gray-300 focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all resize-none"
          />
        </div>

        {/* Urgent checkbox */}
        <label className="flex items-start gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={isUrgent}
            onChange={(e) => setIsUrgent(e.target.checked)}
            className="mt-0.5 rounded text-rose-600 focus:ring-rose-300 h-4 w-4 border-gray-300"
          />
          <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors leading-relaxed">
            Tandai sebagai pesan mendesak{' '}
            <span className="font-semibold">
              (High Priority Push Notification)
            </span>
          </span>
        </label>
      </div>

      {/* Footer */}
      <div className="p-6 bg-gray-50 rounded-b-xl border-t border-gray-200">
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          className="w-full bg-rose-600 text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-rose-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Rocket size={16} />
          {isSubmitting ? 'Mengirim...' : 'Broadcast Sekarang'}
        </button>
        <p className="text-[10px] text-center text-gray-400 mt-2">
          Estimasi mencapai:{' '}
          <span className="font-bold text-gray-700">
            {ESTIMATED_REACH[target]} pengguna
          </span>
        </p>
      </div>
    </div>
  );
}
