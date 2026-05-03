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

export type BloodGroup = 'A' | 'B' | 'AB' | 'O';
export type RhesusType = '+' | '-';
export type ComponentType =
  | 'Whole Blood'
  | 'PRC (Packed Red Cells)'
  | 'FFP (Fresh Frozen Plasma)'
  | 'Platelets'
  | 'Cryoprecipitate';

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

export interface UpdateStockFormValues {
  bloodGroup: BloodGroup;
  rhesus: RhesusType;
  component: ComponentType;
  totalBags: number;
  minThreshold: number;
  expiryDate: string;
  storageLocation: string;
  notes: string;
}
