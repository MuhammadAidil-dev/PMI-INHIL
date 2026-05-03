'use client';

import { BloodGroup, RhesusType } from '../types/inventory.types';

const BLOOD_GROUPS: BloodGroup[] = ['A', 'B', 'AB', 'O'];

interface BloodGroupSelectorProps {
  selectedGroup: BloodGroup;
  selectedRhesus: RhesusType;
  onGroupChange: (group: BloodGroup) => void;
  onRhesusChange: (rhesus: RhesusType) => void;
}

export function BloodGroupSelector({
  selectedGroup,
  selectedRhesus,
  onGroupChange,
  onRhesusChange,
}: BloodGroupSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500">
        Golongan Darah
      </label>

      {/* Blood Group Grid */}
      <div className="grid grid-cols-4 gap-2">
        {BLOOD_GROUPS.map((group) => {
          const isActive = selectedGroup === group;
          return (
            <button
              key={group}
              type="button"
              onClick={() => onGroupChange(group)}
              className={`py-3 rounded-lg font-bold text-sm border transition-all duration-150
                ${
                  isActive
                    ? 'border-rose-600 bg-rose-50 text-rose-600 shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:border-rose-400 hover:text-rose-500'
                }`}
            >
              {group}
            </button>
          );
        })}
      </div>

      {/* Rhesus Selector */}
      <div className="flex gap-6 pt-1">
        {(['+', '-'] as RhesusType[]).map((rh) => (
          <label key={rh} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="rhesus"
              value={rh}
              checked={selectedRhesus === rh}
              onChange={() => onRhesusChange(rh)}
              className="text-rose-600 focus:ring-rose-500 border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">
              Rhesus {rh}
            </span>
          </label>
        ))}
      </div>

      {/* Preview badge */}
      <div className="pt-1">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
          {selectedGroup}
          {selectedRhesus}
        </span>
      </div>
    </div>
  );
}
