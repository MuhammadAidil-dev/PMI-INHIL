'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

const BLOOD_TYPES = ['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

type DonorFilterBarProps = {
  onSearch?: (value: string) => void;
  onBloodTypeChange?: (type: string) => void;
};

export function DonorFilterBar({
  onSearch,
  onBloodTypeChange,
}: DonorFilterBarProps) {
  const [activeType, setActiveType] = useState('All');

  const handleTypeClick = (type: string) => {
    setActiveType(type);
    onBloodTypeChange?.(type);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
      {/* Search */}
      <div className="relative w-full md:w-96">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary"
        />
        <input
          type="text"
          placeholder="Cari nama, ID, atau nomor HP..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm text-foreground placeholder:text-tertiary"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      {/* Blood Type Filter */}
      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        <span className="text-xs font-semibold text-tertiary whitespace-nowrap">
          Golongan Darah:
        </span>
        <div className="flex gap-1.5">
          {BLOOD_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => handleTypeClick(type)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                activeType === type
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-tertiary hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
