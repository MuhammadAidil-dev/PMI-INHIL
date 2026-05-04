// Golongan darah yang valid
export type BloodType = 'A' | 'B' | 'AB' | 'O';
export type RhesusType = '+' | '-';

export type StockUpdatedBy = {
  _id: string;
  username: string;
};

export interface IBloodStock {
  id: string;
  label: string; // contoh: "A+"
  bloodType: string;
  rhesus: string;
  totalBags: number;
  minThreshold: number;
  isCritical: boolean;
  lastUpdated: Date;
  updatedBy: StockUpdatedBy;
}
