import { create } from 'zustand';
import { Admin } from '../type/auth.type';
import { authService } from '../service/auth.service';

// ============================================================
// Auth Store (Zustand)
//
// Menyimpan data admin yang sedang login di memory client.
// Token TIDAK disimpan di sini — token ada di httpOnly cookie
// dan dibaca otomatis oleh browser saat request ke server.
//
// Alur session restore:
// App mount → initSession() → GET /auth/me → simpan admin ke store
// ============================================================

interface AuthStore {
  admin: Admin | null;
  isLoading: boolean;
  isInitialized: boolean;

  /** Restore session saat app mount — panggil sekali di layout */
  initSession: () => Promise<void>;
  /** Set data admin (dipanggil setelah login berhasil jika perlu) */
  setAdmin: (admin: Admin) => void;
  /** Clear state (dipanggil setelah logout) */
  clearSession: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  admin: null,
  isLoading: false,
  isInitialized: false,

  initSession: async () => {
    set({ isLoading: true });

    const { data, error } = await authService.getMe();

    if (error || !data) {
      // Token tidak ada atau expired — biarkan middleware yang redirect
      set({ admin: null, isLoading: false, isInitialized: true });
      return;
    }

    set({ admin: data, isLoading: false, isInitialized: true });
  },

  setAdmin: (admin) => set({ admin }),

  clearSession: () => set({ admin: null, isInitialized: false }),
}));

// ── Selector helpers ──────────────────────────────────────
// Gunakan selector untuk avoid unnecessary re-render

export const selectAdmin = (s: AuthStore) => s.admin;
export const selectIsLoading = (s: AuthStore) => s.isLoading;
export const selectIsInitialized = (s: AuthStore) => s.isInitialized;
