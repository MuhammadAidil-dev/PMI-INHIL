import { AlertTriangle } from 'lucide-react';
import { BloodStock } from '../../types/admin-inventory.type';

interface CriticalLevelsCardProps {
  criticalStocks: BloodStock[];
}

export function CriticalLevelsCard({
  criticalStocks,
}: CriticalLevelsCardProps) {
  return (
    <div className="lg:col-span-4 bg-white border border-gray-100 rounded-xl p-6 flex flex-col justify-between shadow-sm">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="bg-rose-50 p-2 rounded-lg text-rose-600">
            <AlertTriangle size={20} />
          </span>
          <span className="text-rose-600 text-xs font-semibold border border-rose-200 px-3 py-1 rounded-full">
            Urgent
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Critical Levels</h3>
        <p className="text-gray-500 text-sm mt-1">
          {criticalStocks.length} blood type
          {criticalStocks.length !== 1 ? 's' : ''} are below emergency
          thresholds.
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {criticalStocks.map((stock) => (
          <span
            key={stock.id}
            className="border border-rose-200 text-rose-600 px-3 py-1 rounded-full text-xs font-semibold"
          >
            {stock.bloodType} ({stock.component.split(' ')[0]})
          </span>
        ))}
      </div>
    </div>
  );
}
