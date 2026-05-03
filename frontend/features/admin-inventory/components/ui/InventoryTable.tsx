import { BloodStock } from '../../types/admin-inventory.type';
import { BloodTypeAvatar } from './BloodtypeAvatar';
import { StatusBadge } from './StatusBadge';

const TABLE_HEADERS = [
  { label: 'Blood Type', align: 'left' },
  { label: 'Component', align: 'left' },
  { label: 'Units Available', align: 'left' },
  { label: 'Status', align: 'left' },
  { label: 'Actions', align: 'right' },
];

interface InventoryTableProps {
  stocks: BloodStock[];
  onUpdateStock?: (stock: BloodStock) => void;
}

export function InventoryTable({ stocks, onUpdateStock }: InventoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            {TABLE_HEADERS.map(({ label, align }) => (
              <th
                key={label}
                className={`px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-widest
                  ${align === 'right' ? 'text-right' : 'text-left'}`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">
          {stocks.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-12 text-center text-sm text-gray-400"
              >
                Tidak ada data yang cocok dengan filter.
              </td>
            </tr>
          ) : (
            stocks.map((stock) => (
              <tr
                key={stock.id}
                className="hover:bg-gray-50/60 transition-colors"
              >
                {/* Blood Type */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <BloodTypeAvatar type={stock.bloodType} />
                    <span className="font-semibold text-gray-900 text-sm">
                      {stock.label}
                    </span>
                  </div>
                </td>

                {/* Component */}
                <td className="px-6 py-5 text-sm text-gray-500">
                  {stock.component}
                </td>

                {/* Units */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold text-sm ${
                        stock.status === 'Critical'
                          ? 'text-rose-600'
                          : 'text-gray-900'
                      }`}
                    >
                      {stock.units}
                    </span>
                    <span className="text-xs text-gray-400">
                      / {stock.limit} limit
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-5">
                  <StatusBadge status={stock.status} />
                </td>

                {/* Actions */}
                <td className="px-6 py-5 text-right">
                  <button
                    onClick={() => onUpdateStock?.(stock)}
                    className="text-rose-600 text-sm font-medium hover:underline underline-offset-4 decoration-2 transition-all"
                  >
                    Update Stock
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
