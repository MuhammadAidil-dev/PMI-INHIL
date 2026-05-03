'use client';

import { Minus, Plus } from 'lucide-react';

interface BagCounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function BagCounter({
  value,
  onChange,
  min = 1,
  max = 999,
}: BagCounterProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <div className="space-y-2">
      <label
        htmlFor="totalBags"
        className="block text-xs font-semibold tracking-widest uppercase text-gray-500"
      >
        Total Kantong
      </label>

      <div className="relative flex items-center">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className="absolute left-2 w-9 h-9 flex items-center justify-center rounded-md
            text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-all
            disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Minus size={16} />
        </button>

        <input
          id="totalBags"
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
          }}
          className="w-full h-12 text-center rounded-lg border border-gray-200 text-xl font-bold
            text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500
            focus:border-transparent transition-all [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none"
        />

        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className="absolute right-2 w-9 h-9 flex items-center justify-center rounded-md
            text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-all
            disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus size={16} />
        </button>
      </div>

      <p className="text-xs text-gray-400">
        Standar volume per kantong: 350ml – 450ml
      </p>
    </div>
  );
}
