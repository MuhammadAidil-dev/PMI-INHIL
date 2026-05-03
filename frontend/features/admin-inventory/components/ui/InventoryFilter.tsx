'use client';

import { Search } from 'lucide-react';
import { InventoryFilterState } from '../../types/admin-inventory.type';
import {
  STATUS_OPTIONS,
  COMPONENT_OPTIONS,
} from '../../constants/admin-inventory.constant';

interface InventoryFiltersProps {
  filters: InventoryFilterState;
  onChange: (updated: Partial<InventoryFilterState>) => void;
}

export function InventoryFilters({ filters, onChange }: InventoryFiltersProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
      {/* Search */}
      <div className="relative w-full md:w-80">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Filter by Blood Type or Component..."
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Dropdowns */}
      <div className="flex gap-3 w-full md:w-auto">
        <select
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value })}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
        >
          <option value="All Status">All Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={filters.component}
          onChange={(e) => onChange({ component: e.target.value })}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
        >
          <option value="All Components">All Components</option>
          {COMPONENT_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
