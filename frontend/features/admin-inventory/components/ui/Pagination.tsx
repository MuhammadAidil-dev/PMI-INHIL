'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  filteredItems: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  filteredItems,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
      <p className="text-xs text-gray-400">
        Showing {filteredItems} of {totalItems} results
      </p>

      <div className="flex gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center
            hover:bg-gray-50 transition-all text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all
              ${
                currentPage === page
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-200'
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center
            hover:bg-gray-50 transition-all text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
