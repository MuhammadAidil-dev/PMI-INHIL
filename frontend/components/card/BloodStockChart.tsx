export type BloodTypeStock = {
  type: string;
  percentage: number;
  isCritical?: boolean;
};

type BloodStockChartProps = {
  stocks: BloodTypeStock[];
  lastUpdated?: string;
};

const Y_LABELS = ['100%', '75%', '50%', '25%', '0%'];

export default function BloodStockChart({
  stocks,
  lastUpdated,
}: BloodStockChartProps) {
  const criticalTypes = stocks.filter((s) => s.isCritical).map((s) => s.type);

  return (
    <div className="lg:col-span-8 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 flex justify-between items-center">
        <h3 className="font-medium text-gray-900 text-[15px]">
          Inventory darah berdasarkan tipe
        </h3>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />
            Stok kritis
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-rose-300 inline-block" />
            Stok aman
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="px-6 pb-4 flex gap-2 grow">
        {/* Y-axis */}
        <div className="flex flex-col justify-between h-52 pb-6 mr-1">
          {Y_LABELS.map((label) => (
            <span
              key={label}
              className="text-[11px] text-gray-300 leading-none text-right"
            >
              {label}
            </span>
          ))}
        </div>

        {/* Bars + grid */}
        <div className="relative grow">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
            {Y_LABELS.map((label) => (
              <div key={label} className="w-full border-t border-gray-100" />
            ))}
          </div>

          {/* Bars */}
          <div className="absolute inset-0 flex items-end justify-around pb-6 px-2 gap-1">
            {stocks.map((stock) => (
              <div
                key={stock.type}
                className="flex flex-col items-center flex-1 max-w-12 gap-1.5 h-full justify-end"
              >
                {/* Percentage label */}
                <span className="text-[11px] font-medium text-gray-400 leading-none">
                  {stock.percentage}%
                </span>

                {/* Bar */}
                <div className="relative w-full flex items-end justify-center">
                  {stock.isCritical && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-rose-600 bg-rose-50 rounded px-1 py-0.5 leading-none">
                      !
                    </span>
                  )}
                  <div
                    className={`w-full rounded-t-sm transition-all duration-700 ${
                      stock.isCritical ? 'bg-rose-600' : 'bg-rose-300'
                    }`}
                    style={{
                      height: `${Math.max(stock.percentage, 4)}%`,
                      maxHeight: '176px',
                    }}
                  />
                </div>

                {/* Type label */}
                <span
                  className={`text-[11px] font-medium leading-none ${
                    stock.isCritical ? 'text-rose-600' : 'text-gray-400'
                  }`}
                >
                  {stock.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-50 flex flex-wrap justify-between items-center gap-2">
        <p className="text-[11px] text-gray-400">
          {lastUpdated && `Diperbarui: ${lastUpdated}.`}
          {criticalTypes.length > 0 && (
            <span className="text-rose-500 ml-1">
              Stok kritis: {criticalTypes.join(', ')}.
            </span>
          )}
        </p>

        {/* Summary pills */}
        <div className="flex flex-wrap gap-1.5">
          {stocks.map((stock) => (
            <span
              key={stock.type}
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                stock.isCritical
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {stock.type} · {stock.isCritical ? 'kritis' : 'aman'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
