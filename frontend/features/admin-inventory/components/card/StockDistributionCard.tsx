import { STOCK_DISTRIBUTION } from '../../constants/admin-inventory.constant';
import { StockDistribution } from '../../types/admin-inventory.type';

interface StockDistributionCardProps {
  distributions?: StockDistribution[];
  updatedLabel?: string;
}

export function StockDistributionCard({
  distributions = STOCK_DISTRIBUTION,
  updatedLabel = 'Updated 2m ago',
}: StockDistributionCardProps) {
  return (
    <div className="lg:col-span-5 bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold text-gray-900">
          Stock Distribution
        </h3>
        <span className="text-xs text-gray-400">{updatedLabel}</span>
      </div>
      <div className="space-y-5">
        {distributions.map(({ label, percentage, colorClass }) => (
          <div key={label}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-500">{label}</span>
              <span className="font-bold text-gray-700">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div
                className={`${colorClass} h-full rounded-full transition-all duration-700`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
