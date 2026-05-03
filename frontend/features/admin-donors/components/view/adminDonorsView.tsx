'use client';

import { useState } from 'react';
import { FileDown, UserPlus, TrendingUp, AlertTriangle } from 'lucide-react';

import { DonorStatCard } from '../card/DonorstatCard';
import { DonorFilterBar } from '../ui/Donorfilterbar';
import { DonorTable } from '../ui/DonorTable';
import { MOCK_DONORS } from '../../constants/donors.data';
import { Donor } from '../ui/DonorTableRow';

export default function AdminDonorView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodType, setSelectedBloodType] = useState('All');

  // Filter donors based on search & blood type
  const filteredDonors = MOCK_DONORS.filter((donor) => {
    const matchSearch =
      searchQuery === '' ||
      donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.donorId.includes(searchQuery);

    const matchBloodType =
      selectedBloodType === 'All' || donor.bloodType === selectedBloodType;

    return matchSearch && matchBloodType;
  });

  const handleChat = (donor: Donor) => {
    // TODO: integrate WhatsApp Gateway API
    console.log('Send WA to:', donor.name);
  };

  const handleView = (donor: Donor) => {
    // TODO: navigate to donor detail page
    console.log('View donor:', donor.id);
  };

  return (
    <main className="lg:ml-64 w-full p-6 bg-gray-50 min-h-[calc(100vh-60px)]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral tracking-tight mb-1">
            Database Pendonor
          </h1>
          <p className="text-tertiary text-base">
            Kelola dan pantau pendonor darah aktif di PMI Kabupaten Indragiri
            Hilir.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button className="bg-white border border-gray-200 text-neutral px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-secondary transition-colors">
            <FileDown size={16} />
            Export CSV
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-hover transition-colors shadow-sm">
            <UserPlus size={16} />
            Daftarkan Pendonor
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
        <DonorStatCard
          label="Total Pendonor"
          value="12.842"
          subtitle="+12% bulan ini"
          subtitleColor="text-green-600"
          icon={TrendingUp}
        />
        <DonorStatCard
          label="Pendonor Aktif"
          value="4.301"
          subtitle="Siap mendonor"
          subtitleColor="text-primary"
        />
        <DonorStatCard
          label="Mobile Unit"
          value="18"
          subtitle="Aktif hari ini"
          subtitleColor="text-blue-600"
        />
        <DonorStatCard
          label="Kebutuhan Mendesak"
          value="O-"
          subtitle="Stok Kritis"
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      {/* Filter Bar */}
      <DonorFilterBar
        onSearch={setSearchQuery}
        onBloodTypeChange={setSelectedBloodType}
      />

      {/* Donor Table */}
      <DonorTable
        donors={filteredDonors}
        currentPage={currentPage}
        totalDonors={12842}
        perPage={10}
        onPageChange={setCurrentPage}
        onChat={handleChat}
        onView={handleView}
      />
    </main>
  );
}
