export type BloodTypeStock = {
  type: string;
  percentage: number; // 0-100
  isCritical?: boolean;
};

type BloodStockChartProps = {
  stocks: BloodTypeStock[];
  lastUpdated?: string;
};

export default function BloodStockChart({
  stocks,
  lastUpdated,
}: BloodStockChartProps) {
  const criticalTypes = stocks.filter((s) => s.isCritical).map((s) => s.type);

  return (
    <div className="lg:col-span-8 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
      <div className="px-6 py-5 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">
          Inventory Darah Berdasarkan Tipe
        </h3>
      </div>

      <div className="px-6 pb-8 grow flex items-end justify-around h-64 gap-4">
        {stocks.map((stock) => (
          <div
            key={stock.type}
            className="flex flex-col items-center w-full max-w-10 gap-3"
          >
            <div
              className={`w-full rounded-t-sm transition-all duration-700 ${
                stock.isCritical ? 'bg-rose-600' : 'bg-rose-400'
              }`}
              style={{ height: `${stock.percentage}%` }}
            />
            <span
              className={`text-xs font-medium ${
                stock.isCritical ? 'text-rose-600 font-bold' : 'text-gray-400'
              }`}
            >
              {stock.type}
            </span>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-gray-50">
        <p className="text-[10px] text-gray-400">
          {lastUpdated && `Last updated: ${lastUpdated}.`}
          {criticalTypes.length > 0 && (
            <span className="text-rose-500 ml-1">
              Low stock warning for {criticalTypes.join(', ')}.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
