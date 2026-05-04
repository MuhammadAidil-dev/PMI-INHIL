export enum BloodType {
  A_POS = 'A+',
  A_NEG = 'A-',
  B_POS = 'B+',
  B_NEG = 'B-',
  AB_POS = 'AB+',
  AB_NEG = 'AB-',
  O_POS = 'O+',
  O_NEG = 'O-',
}

export enum Gender {
  MALE = 'L',
  FEMALE = 'P',
}

export enum DonorStatus {
  ACTIVE = 'active', // eligible donor lagi
  INACTIVE = 'inactive', // belum pernah donor
  COOLDOWN = 'cooldown', // belum 90 hari sejak donor terakhir
}

export interface IDonor {
  _id: string;
  fullName: string;
  nik: string; // 16 digit, unique
  gender: Gender;
  birthDate: Date;
  address: string;
  phone: string; // nomor WA, unique, dipakai notifikasi
  bloodType: BloodType;
  weight: number; // minimal 45 kg
  hemoglobin?: number;
  status: DonorStatus;
  totalDonations: number;
  lastDonationDate?: Date;
  nextEligibleDate?: Date; // lastDonationDate + 90 hari (dihitung otomatis)
  lastNotificationSentAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // methods
  isEligible(): boolean;
  getDaysUntilEligible(): number;
}

// ── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreateDonorDto {
  fullName: string;
  nik: string;
  gender: Gender;
  birthDate: string; // ISO string dari client
  address: string;
  phone: string;
  bloodType: BloodType;
  weight: number;
  hemoglobin?: number;
}

export interface UpdateDonorDto {
  fullName?: string;
  gender?: Gender;
  birthDate?: string;
  address?: string;
  phone?: string;
  bloodType?: BloodType;
  weight?: number;
  hemoglobin?: number;
  isActive?: boolean;
}

export interface QueryDonorDto {
  page?: number;
  limit?: number;
  search?: string; // cari by nama / NIK / phone
  bloodType?: BloodType;
  status?: DonorStatus;
  isActive?: boolean;
}

// ── Response DTOs ─────────────────────────────────────────────────────────────
export interface DonorResponse {
  id: string;
  fullName: string;
  nik: string;
  gender: Gender;
  birthDate: string;
  address: string;
  phone: string;
  bloodType: BloodType;
  weight: number;
  hemoglobin?: number;
  status: DonorStatus;
  totalDonations: number;
  lastDonationDate: string | null;
  nextEligibleDate: string | null;
  daysUntilEligible: number;
  isEligible: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedDonorResponse {
  data: DonorResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
