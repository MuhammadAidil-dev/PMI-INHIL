'use client';

import { useState } from 'react';
import { Save, X, ClipboardEdit, ShieldCheck } from 'lucide-react';

import { BloodGroupSelector } from './BloodGroupSelector';
import { BagCounter } from './BagCounter';
import { ThresholdInput } from './ThresholdInput';
import {
  BloodGroup,
  RhesusType,
  UpdateStockFormValues,
} from '../../types/admin-inventory.type';

const DEFAULT_VALUES: UpdateStockFormValues = {
  bloodGroup: 'A',
  rhesus: '+',
  component: 'PRC (Packed Red Cells)',
  totalBags: 1,
  minThreshold: 10,
  expiryDate: '',
  storageLocation: '',
  notes: '',
};

interface UpdateStockFormProps {
  inventoryId?: string;
  onSubmit?: (values: UpdateStockFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

export function UpdateStockForm({
  inventoryId = 'PMI-REG-2024-081',
  onSubmit,
  onCancel,
}: UpdateStockFormProps) {
  const [values, setValues] = useState<UpdateStockFormValues>(DEFAULT_VALUES);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = <K extends keyof UpdateStockFormValues>(
    key: K,
    value: UpdateStockFormValues[K],
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleReset = () => setValues(DEFAULT_VALUES);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit?.(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      {/* Card Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <ClipboardEdit size={16} className="text-rose-600" />
          Informasi Komponen Darah
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <ShieldCheck size={14} className="text-gray-400" />
          <span>Inventory ID: {inventoryId}</span>
        </div>
      </div>

      {/* Form */}
      <form action={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Blood Group */}
          <BloodGroupSelector
            selectedGroup={values.bloodGroup}
            selectedRhesus={values.rhesus}
            onGroupChange={(g: BloodGroup) => set('bloodGroup', g)}
            onRhesusChange={(r: RhesusType) => set('rhesus', r)}
          />

          {/* Total Bags */}
          <BagCounter
            value={values.totalBags}
            onChange={(v) => set('totalBags', v)}
          />

          {/* Minimum Threshold */}
          <ThresholdInput
            value={values.minThreshold}
            onChange={(v) => set('minThreshold', v)}
          />

          {/* Notes — full width */}
          <div className="md:col-span-2 space-y-2">
            <label
              htmlFor="notes"
              className="block text-xs font-semibold tracking-widest uppercase text-gray-500"
            >
              Catatan Tambahan
            </label>
            <textarea
              id="notes"
              rows={3}
              value={values.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Tambahkan catatan opsional mengenai kondisi sampel, asal donor, atau informasi lainnya..."
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-800
                placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500
                focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Actions — full width */}
          <div className="md:col-span-2 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onCancel ?? handleReset}
              className="flex items-center justify-center gap-2 px-8 h-11 border border-gray-200
                text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all"
            >
              <X size={16} />
              Bersihkan Formulir
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-8 h-11 bg-rose-600 text-white
                text-sm font-semibold rounded-lg hover:bg-rose-700 transition-all
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {isSubmitting ? 'Menyimpan...' : 'Perbarui Inventaris'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
