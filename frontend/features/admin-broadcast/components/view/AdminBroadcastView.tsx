'use client';

import { useState } from 'react';
import { PlusCircle, Eye, BellRing, TrendingUp } from 'lucide-react';
import {
  NewsItem,
  BroadcastPayload,
} from '../../types/admin-berita-broadcast.type';
import NewsTable from '../ui/NewsTable';
import BroadcastForm from '../ui/BroadcastForm';
import StatsCard from '../card/StatCard';
import Link from 'next/link';

// ─── Mock data (ganti dengan fetch dari API) ───────────────────────────
const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Kebutuhan Mendesak Golongan Darah O+ di Kabupaten Indragiri Hilir',
    category: 'Darurat',
    status: 'published',
    date: '12 Okt 2024',
    imageUrl: undefined,
  },
  {
    id: '2',
    title: 'Jadwal Mobil Unit Donor Darah Minggu Ini',
    category: 'Edukasi',
    status: 'draft',
    date: '10 Okt 2024',
    imageUrl: undefined,
  },
  {
    id: '3',
    title: 'Pentingnya Donor Darah Rutin Setiap 3 Bulan',
    category: 'Kesehatan',
    status: 'published',
    date: '05 Okt 2024',
    imageUrl: undefined,
  },
];
// ───────────────────────────────────────────────────────────────────────

export default function AdminBroadcastView() {
  const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);
  const [currentPage, setCurrentPage] = useState(1);

  const handleEdit = (id: string) => {
    // TODO: buka modal edit atau navigasi ke halaman edit
    console.log('Edit:', id);
  };

  const handleDelete = (id: string) => {
    // TODO: tambahkan konfirmasi modal sebelum delete
    setNews((prev) => prev.filter((item) => item.id !== id));
  };

  const handleBroadcast = async (payload: BroadcastPayload) => {
    // TODO: panggil API broadcast via apiClient
    console.log('Broadcast payload:', payload);
    // Contoh: await apiClient.post('/notifications/broadcast', payload);
    alert(`Broadcast berhasil dikirim ke target: ${payload.target}`);
  };

  return (
    <main className="lg:ml-64 w-full p-6 bg-gray-50 min-h-[calc(100vh-60px)]">
      {/* ─── Page Header ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Manajemen Berita &amp; Notifikasi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola konten informasi publik dan pemberitahuan massal untuk
            seluruh jejaring donor.
          </p>
        </div>
        <Link
          href={'/broadcast/add'}
          className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-rose-700 active:scale-[0.98] transition-all self-start md:self-auto"
        >
          <PlusCircle size={16} />
          Tambah Berita Baru
        </Link>
      </div>

      {/* ─── Bento Grid: Table + Broadcast Form ─── */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* News Table — 8/12 columns */}
        <div className="lg:col-span-8">
          <NewsTable
            items={news}
            total={128}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Broadcast Form — 4/12 columns */}
        <div className="lg:col-span-4">
          <BroadcastForm onSubmit={handleBroadcast} />
        </div>
      </div>

      {/* ─── Stats Summary Cards ─── */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          label="Total Pembaca"
          value="45.2k"
          icon={Eye}
          iconBgClassName="bg-rose-50"
          iconColorClassName="text-rose-600"
        />
        <StatsCard
          label="Sent Alerts (30 Hari)"
          value={18}
          icon={BellRing}
          iconBgClassName="bg-blue-50"
          iconColorClassName="text-blue-600"
        />
        <StatsCard
          label="Engagement Rate"
          value="8.4%"
          icon={TrendingUp}
          iconBgClassName="bg-green-50"
          iconColorClassName="text-green-600"
        />
      </div>
    </main>
  );
}
