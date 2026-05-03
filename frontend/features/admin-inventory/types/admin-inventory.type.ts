export type BloodStatus = 'Critical' | 'Low' | 'Stable';

export interface BloodStock {
  id: string;
  bloodType: string;
  label: string;
  component: string;
  units: number;
  limit: number;
  status: BloodStatus;
}

export interface StockDistribution {
  label: string;
  percentage: number;
  colorClass: string;
}

export interface InventoryFilterState {
  search: string;
  status: string;
  component: string;
}
