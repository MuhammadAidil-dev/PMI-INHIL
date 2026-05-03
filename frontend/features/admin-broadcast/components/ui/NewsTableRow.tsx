import Image from 'next/image';
import { Pencil, Trash2 } from 'lucide-react';
import { NewsItem } from '../../types/admin-berita-broadcast.type';
import StatusBadge from './StatusBadge';

interface NewsTableRowProps {
  item: NewsItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NewsTableRow({
  item,
  onEdit,
  onDelete,
}: NewsTableRowProps) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Judul */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0 relative">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-rose-100 flex items-center justify-center">
                <span className="text-rose-400 text-xs font-bold">PMI</span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 line-clamp-1">
              {item.title}
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
              Kategori: {item.category}
            </p>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <StatusBadge status={item.status} />
      </td>

      {/* Tanggal */}
      <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">
        {item.date}
      </td>

      {/* Aksi */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(item.id)}
            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            title="Edit berita"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Hapus berita"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
