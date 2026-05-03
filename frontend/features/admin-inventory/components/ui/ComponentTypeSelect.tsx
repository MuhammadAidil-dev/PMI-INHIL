'use client';

import { ComponentType } from '../../types/admin-inventory.type';

const COMPONENT_OPTIONS: ComponentType[] = [
  'Whole Blood',
  'PRC (Packed Red Cells)',
  'FFP (Fresh Frozen Plasma)',
  'Platelets',
  'Cryoprecipitate',
];

// Info label per component
const COMPONENT_INFO: Record<ComponentType, string> = {
  'Whole Blood': 'Darah lengkap, tidak diproses. Masa simpan ±35 hari.',
  'PRC (Packed Red Cells)': 'Sel darah merah pekat. Simpan pada 2°C – 6°C.',
  'FFP (Fresh Frozen Plasma)':
    'Plasma beku segar. Simpan pada -18°C atau lebih rendah.',
  Platelets: 'Trombosit. Simpan pada 20°C – 24°C dengan agitasi konstan.',
  Cryoprecipitate: 'Mengandung faktor VIII & fibrinogen. Simpan pada -18°C.',
};

interface ComponentTypeSelectProps {
  value: ComponentType;
  onChange: (value: ComponentType) => void;
}

export function ComponentTypeSelect({
  value,
  onChange,
}: ComponentTypeSelectProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="component"
        className="block text-xs font-semibold tracking-widest uppercase text-gray-500"
      >
        Jenis Komponen
      </label>

      <select
        id="component"
        value={value}
        onChange={(e) => onChange(e.target.value as ComponentType)}
        className="w-full h-12 rounded-lg border border-gray-200 px-3 text-sm text-gray-800
          focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent
          transition-all cursor-pointer"
      >
        {COMPONENT_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {/* Dynamic hint per selected component */}
      <p className="text-xs text-gray-400 leading-relaxed">
        {COMPONENT_INFO[value]}
      </p>
    </div>
  );
}
