interface TotalUnitsCardProps {
  total: number;
  changeLabel?: string;
  capacityLabel?: string;
  capacityValue?: string;
}

export function TotalUnitsCard({
  total,
  changeLabel = '+12% from yesterday',
  capacityLabel = 'Regional Capacity',
  capacityValue = '78%',
}: TotalUnitsCardProps) {
  return (
    <div className="lg:col-span-3 bg-gray-900 rounded-xl p-6 text-white flex flex-col justify-between shadow-sm">
      <div>
        <h3 className="text-xs font-medium opacity-60 uppercase tracking-widest">
          Total Units Available
        </h3>
        <div className="mt-4">
          <span className="text-5xl font-bold tracking-tight">
            {total.toLocaleString()}
          </span>
          <span className="text-emerald-400 text-xs font-semibold block mt-2">
            {changeLabel}
          </span>
        </div>
      </div>
      <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
        <span className="text-xs opacity-50">{capacityLabel}</span>
        <span className="text-xs font-bold">{capacityValue}</span>
      </div>
    </div>
  );
}
