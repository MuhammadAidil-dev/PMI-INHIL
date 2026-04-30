import { Document, Types } from 'mongoose';

// ── Enums ─────────────────────────────────────────────────────────────────────

export enum TransactionType {
  IN = 'in', // darah masuk (donor)
  OUT = 'out', // darah keluar (distribusi ke RS / pasien)
}

// Selaraskan persis dengan bloodStock.type
export type BloodType = 'A' | 'B' | 'AB' | 'O';
export type RhesusType = '+' | '-';

export enum BloodComponent {
  WHOLE_BLOOD = 'Whole Blood',
  PRC = 'PRC',
  FFP = 'FFP',
  PLATELETS = 'Platelets',
  CRYOPRECIPITATE = 'Cryoprecipitate',
}

export enum TransactionStatus {
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// ── Mongoose Document Interface ───────────────────────────────────────────────

export interface ITransaction extends Document {
  _id: Types.ObjectId;

  type: TransactionType;

  // Referensi pendonor (hanya untuk type = 'in')
  donorId?: Types.ObjectId | null;
  donorName?: string | null; // snapshot agar histori tetap valid jika donor dihapus

  // Detail darah — dipisah agar selaras dengan BloodStockModel
  bloodType: BloodType;
  rhesus: RhesusType;
  component: BloodComponent;
  quantity: number; // jumlah kantong

  // Untuk transaksi keluar: tujuan distribusi
  recipientName?: string | null;
  recipientHospital?: string | null;
  recipientPhone?: string | null;
  notes?: string | null;

  status: TransactionStatus;
  transactionDate: Date;

  // Audit
  createdBy: Types.ObjectId; // ref ke Admin._id
  createdAt: Date;
  updatedAt: Date;
}

// ── DTOs ──────────────────────────────────────────────────────────────────────

export interface CreateTransactionInDto {
  donorId: string;
  bloodType: BloodType;
  rhesus: RhesusType;
  component: BloodComponent;
  quantity: number;
  notes?: string;
  transactionDate?: string; // ISO string, default now
}

export interface CreateTransactionOutDto {
  bloodType: BloodType;
  rhesus: RhesusType;
  component: BloodComponent;
  quantity: number;
  recipientName: string;
  recipientHospital: string;
  recipientPhone?: string;
  notes?: string;
  transactionDate?: string;
}

export interface UpdateTransactionDto {
  notes?: string;
  recipientName?: string;
  recipientHospital?: string;
  recipientPhone?: string;
}

export interface QueryTransactionDto {
  page?: number;
  limit?: number;
  type?: TransactionType;
  bloodType?: BloodType;
  rhesus?: RhesusType;
  component?: BloodComponent;
  status?: TransactionStatus;
  donorId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

// ── Response Shapes ───────────────────────────────────────────────────────────

export interface TransactionResponse {
  id: string;
  type: TransactionType;
  donorId: string | null;
  donorName: string | null;
  bloodType: BloodType;
  rhesus: RhesusType;
  bloodLabel: string; // "A+", "B-", dsb — computed field
  component: BloodComponent;
  quantity: number;
  recipientName: string | null;
  recipientHospital: string | null;
  recipientPhone: string | null;
  notes: string | null;
  status: TransactionStatus;
  transactionDate: string;
  createdBy:
    | {
        id: string;
        username: string;
      }
    | string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTransactionResponse {
  data: TransactionResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface TransactionStatsResponse {
  totalIn: number;
  totalOut: number;
  totalCancelled: number;
  byBloodType: Record<string, { in: number; out: number }>;
  byComponent: Record<string, { in: number; out: number }>;
  last30Days: {
    totalIn: number;
    totalOut: number;
  };
}
