import mongoose, { Document, Types } from 'mongoose';

// Golongan darah yang valid
export type BloodType = 'A' | 'B' | 'AB' | 'O';
export type RhesusType = '+' | '-';

export interface IBloodStock extends Document {
  bloodType: BloodType;
  rhesus: RhesusType;
  totalBags: number; // jumlah kantong saat ini
  minThreshold: number; // batas minimum sebelum notifikasi kritis
  lastUpdated: Date;
  updatedBy: mongoose.Types.ObjectId; // referensi ke Admin
}

export type BloodStockLean = {
  _id: Types.ObjectId;
  bloodType: IBloodStock['bloodType'];
  rhesus: IBloodStock['rhesus'];
  totalBags: number;
  minThreshold: number;
  lastUpdated: Date;
  updatedBy:
    | Types.ObjectId
    | { _id: Types.ObjectId; username: string; name: string };
  createdAt?: Date;
  updatedAt?: Date;
  // virtual fields dari schema (tersedia karena lean({ virtuals: true }))
  label?: string;
  isCritical?: boolean;
  __v?: number;
};

// DTO untuk response yang dikembalikan ke controller
export interface BloodStockDTO {
  id: string;
  label: string; // contoh: "A+"
  bloodType: string;
  rhesus: string;
  totalBags: number;
  minThreshold: number;
  isCritical: boolean;
  lastUpdated: Date;
  updatedBy: { username: string } | string;
}
