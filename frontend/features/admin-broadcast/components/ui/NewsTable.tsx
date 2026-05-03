'use client';

import { Filter, ArrowUpDown } from 'lucide-react';
import { NewsItem } from '../../types/admin-berita-broadcast.type';
import NewsTableRow from './NewsTableRow';

interface NewsTableProps {
  items: NewsItem[];
  total: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NewsTable({
  items,
  total,
  currentPage,
  onPageChange,
  onEdit,
  onDelete,
}: NewsTableProps) {
  const itemsPerPage = 10;
  const totalPages = Math.ceil(total / itemsPerPage);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Table Header */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700">
          Daftar Berita &amp; Artikel
        </h3>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded text-[10px] font-bold text-gray-500 uppercase hover:border-rose-300 transition-colors">
            <Filter size={11} />
            Filter
          </button>
          <button className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded text-[10px] font-bold text-gray-500 uppercase hover:border-rose-300 transition-colors">
            <ArrowUpDown size={11} />
            Urutkan
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-gray-400 border-b border-gray-100">
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider">
                Judul Artikel
              </th>
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-sm text-gray-400"
                >
                  Belum ada berita yang tersedia.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <NewsTableRow
                  key={item.id}
                  item={item}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <span className="text-xs text-gray-400">
          Menampilkan {items.length} dari {total} artikel
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => hasPrev && onPageChange(currentPage - 1)}
            disabled={!hasPrev}
            className="text-xs font-bold text-rose-600 hover:underline disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Sebelumnya
          </button>
          <button
            onClick={() => hasNext && onPageChange(currentPage + 1)}
            disabled={!hasNext}
            className="text-xs font-bold text-rose-600 hover:underline disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}
