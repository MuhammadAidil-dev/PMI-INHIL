import { create } from 'zustand';
import type { AppError } from './error';

// ============================================================
// Error Store (Zustand): State error global untuk toast / alert
// ============================================================

export interface ErrorEntry {
  id: string;
  error: AppError;
  /** Timestamp untuk auto-dismiss */
  createdAt: number;
}

interface ErrorStore {
  errors: ErrorEntry[];

  /** Tambah error baru ke antrian */
  addError: (error: AppError) => void;
  /** Hapus error berdasarkan id */
  dismissError: (id: string) => void;
  /** Hapus semua error */
  clearErrors: () => void;
}

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const useErrorStore = create<ErrorStore>((set) => ({
  errors: [],

  addError: (error) =>
    set((state) => ({
      errors: [
        ...state.errors,
        { id: generateId(), error, createdAt: Date.now() },
      ],
    })),

  dismissError: (id) =>
    set((state) => ({
      errors: state.errors.filter((e) => e.id !== id),
    })),

  clearErrors: () => set({ errors: [] }),
}));
