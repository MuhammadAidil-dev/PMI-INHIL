'use client';

import { useState, useMemo } from 'react';

// Components
import { InventoryPageHeader } from '../ui/Inventorypageheader';
import { CriticalLevelsCard } from '../card/CriticalLevelCard';
import { StockDistributionCard } from '../card/StockDistributionCard';
import { TotalUnitsCard } from '../card/TotaluniCard';
import { InventoryFilters } from '../ui/InventoryFilter';
import { InventoryTable } from '../ui/InventoryTable';
import { Pagination } from '../ui/Pagination';

// Types & constants
import {
  BloodStock,
  InventoryFilterState,
} from '../../types/admin-inventory.type';
import { DUMMY_BLOOD_STOCKS } from '../../constants/admin-inventory.constant';

const PAGE_SIZE = 10;

export default function AdminInventoryView() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [stocks] = useState<BloodStock[]>(DUMMY_BLOOD_STOCKS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<InventoryFilterState>({
    search: '',
    status: 'All Status',
    component: 'All Components',
  });

  // ── Derived data ───────────────────────────────────────────────────────────
  const criticalStocks = useMemo(
    () => stocks.filter((s) => s.status === 'Critical'),
    [stocks],
  );

  const totalUnits = useMemo(
    () => stocks.reduce((sum, s) => sum + s.units, 0),
    [stocks],
  );

  const filteredStocks = useMemo(() => {
    return stocks.filter((item) => {
      const q = filters.search.toLowerCase();
      const matchSearch =
        !q ||
        item.bloodType.toLowerCase().includes(q) ||
        item.label.toLowerCase().includes(q) ||
        item.component.toLowerCase().includes(q);

      const matchStatus =
        filters.status === 'All Status' || item.status === filters.status;

      const matchComponent =
        filters.component === 'All Components' ||
        item.component.includes(filters.component);

      return matchSearch && matchStatus && matchComponent;
    });
  }, [stocks, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredStocks.length / PAGE_SIZE));

  const paginatedStocks = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredStocks.slice(start, start + PAGE_SIZE);
  }, [filteredStocks, currentPage]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleFilterChange = (updated: Partial<InventoryFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setCurrentPage(1);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    // TODO: replace with actual API refetch
    await new Promise((r) => setTimeout(r, 1500));
    setIsSyncing(false);
  };

  const handleExport = () => {
    // TODO: implement export logic
    console.log('Export triggered');
  };

  const handleUpdateStock = (stock: BloodStock) => {
    // TODO: open modal or navigate to edit page
    console.log('Update stock:', stock);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className="lg:ml-64 w-full p-6 bg-gray-50 min-h-[calc(100vh-60px)] flex flex-col gap-8">
      {/* Header */}
      <InventoryPageHeader
        onExport={handleExport}
        onSync={handleSync}
        isSyncing={isSyncing}
      />

      {/* Stats Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <CriticalLevelsCard criticalStocks={criticalStocks} />
        <StockDistributionCard />
        <TotalUnitsCard total={totalUnits} />
      </section>

      {/* Table */}
      <section className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <InventoryFilters filters={filters} onChange={handleFilterChange} />
        <InventoryTable
          stocks={paginatedStocks}
          onUpdateStock={handleUpdateStock}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={stocks.length}
          filteredItems={filteredStocks.length}
          onPageChange={setCurrentPage}
        />
      </section>
    </main>
  );
}
