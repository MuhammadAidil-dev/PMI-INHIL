import { Download, RefreshCw } from 'lucide-react';

interface InventoryPageHeaderProps {
  onExport?: () => void;
  onSync?: () => void;
  isSyncing?: boolean;
}

export function InventoryPageHeader({
  onExport,
  onSync,
  isSyncing = false,
}: InventoryPageHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Blood Inventory Stock
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Real-time monitoring and management of regional blood bank reserves.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Download size={16} />
          Export Report
        </button>

        <button
          onClick={onSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
          {isSyncing ? 'Syncing...' : 'Sync Stock'}
        </button>
      </div>
    </header>
  );
}
