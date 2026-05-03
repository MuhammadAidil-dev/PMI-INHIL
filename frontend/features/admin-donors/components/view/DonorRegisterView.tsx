'use client';

import { useRouter } from 'next/navigation';
import { Save, X } from 'lucide-react';
import { DonorRegisterForm } from '../ui/DonorRegisterForm';
import { DonorGuidelinesCard } from '../card/DonorGuidlineCard';
import { DonorLocationCard } from '../card/DonorLocationCard';

export default function DonorRegisterView() {
  const router = useRouter();

  return (
    <main className="lg:ml-64 w-full p-6 bg-gray-50 min-h-[calc(100vh-60px)]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral tracking-tight mb-1">
            Registrasi Pendonor Baru
          </h1>
          <p className="text-tertiary text-base">
            Lengkapi formulir di bawah ini untuk menambahkan data pendonor ke
            dalam basis data PMI.
          </p>
        </div>

        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-neutral text-sm font-semibold rounded-lg hover:bg-secondary transition-colors cursor-pointer"
          >
            <X size={16} />
            Batal
          </button>
          <button
            type="submit"
            form="donor-register-form"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-hover transition-colors shadow-sm cursor-pointer"
          >
            <Save size={16} />
            Simpan Data
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl p-6">
          <DonorRegisterForm />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <DonorGuidelinesCard />
          <DonorLocationCard />
        </div>
      </div>
    </main>
  );
}
