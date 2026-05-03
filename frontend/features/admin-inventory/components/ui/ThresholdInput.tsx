'use client';

import { BellRing } from 'lucide-react';

interface ThresholdInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function ThresholdInput({ value, onChange }: ThresholdInputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="minThreshold"
        className="block text-xs font-semibold tracking-widest uppercase text-gray-500"
      >
        Ambang Batas Minimum
      </label>

      <div className="relative">
        <input
          id="minThreshold"
          type="number"
          value={value}
          min={1}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v) && v >= 1) onChange(v);
          }}
          className="w-full h-12 rounded-lg border border-gray-200 pl-4 pr-12 text-sm
            text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500
            focus:border-transparent transition-all [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none"
        />
        <BellRing
          size={16}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>

      <p className="text-xs text-gray-400">
        Titik pemicu peringatan kritis stok rendah.
      </p>
    </div>
  );
}
