'use client';

import { ChevronRight } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
import { UpdateStockForm } from '../ui/UpdateStockForm';
import { GuidanceCards } from '../card/GuidanceCard';
import { UpdateStockFormValues } from '../../types/admin-inventory.type';

export default function UpdateStockView() {
  const handleSubmit = async (values: UpdateStockFormValues) => {
    // TODO: ganti dengan apiClient.post('/blood-stocks', values)
    console.log('Submitted:', values);
    await new Promise((r) => setTimeout(r, 1000)); // simulasi delay
    alert('Stok berhasil diperbarui!');
  };

  return (
    <main className="lg:ml-64 w-full p-6 bg-gray-50 min-h-[calc(100vh-60px)] flex flex-col gap-8">
      {/* Breadcrumb + Page Header */}
      <div className="space-y-1">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span>Inventory</span>
          <ChevronRight size={12} />
          <span className="text-rose-600 font-medium">Update Stock</span>
        </div>

        {/* Title row */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Update Stok Darah
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Masukkan detail komponen darah yang diterima atau diperbarui ke
              dalam sistem inventaris pusat.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-xs font-medium text-gray-500">
            <ShieldCheck size={13} className="text-emerald-500" />
            System Status: Ready
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <UpdateStockForm onSubmit={handleSubmit} />

      {/* Guidance Cards */}
      <GuidanceCards />
    </main>
  );
}
