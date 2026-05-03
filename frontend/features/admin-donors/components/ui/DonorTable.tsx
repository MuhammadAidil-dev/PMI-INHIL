'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Donor, DonorTableRow } from './DonorTableRow';

type DonorTableProps = {
  donors: Donor[];
  currentPage: number;
  totalDonors: number;
  perPage?: number;
  onPageChange?: (page: number) => void;
  onChat?: (donor: Donor) => void;
  onView?: (donor: Donor) => void;
};

export function DonorTable({
  donors,
  currentPage,
  totalDonors,
  perPage = 10,
  onPageChange,
  onChat,
  onView,
}: DonorTableProps) {
  const totalPages = Math.ceil(totalDonors / perPage);

  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3, '...', totalPages);
    }
    return pages;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-175">
          <thead className="bg-secondary border-b border-gray-200">
            <tr>
              {[
                'Nama Pendonor',
                'Golongan Darah',
                'Donor Terakhir',
                'Lokasi',
                'Status',
                '',
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-xs font-bold text-tertiary uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {donors.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-tertiary text-sm"
                >
                  Tidak ada data pendonor ditemukan.
                </td>
              </tr>
            ) : (
              donors.map((donor) => (
                <DonorTableRow
                  key={donor.id}
                  donor={donor}
                  onChat={onChat}
                  onView={onView}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 bg-secondary border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-tertiary">
          Menampilkan {(currentPage - 1) * perPage + 1}–
          {Math.min(currentPage * perPage, totalDonors)} dari{' '}
          {totalDonors.toLocaleString('id-ID')} pendonor
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border border-gray-200 rounded-lg bg-white text-tertiary hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          {getPageNumbers().map((page, idx) =>
            page === '...' ? (
              <span
                key={`ellipsis-${idx}`}
                className="text-tertiary px-1 text-xs"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange?.(page as number)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'bg-white text-neutral border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ),
          )}

          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-200 rounded-lg bg-white text-tertiary hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
