import { User } from '../users/user.model';
import { IUser } from '../users/user.type';

/**
 * Repository: bertanggung jawab langsung ke database.
 * Tidak ada business logic di sini.
 */
export class AuthRepository {
  /**
   * Cari admin berdasarkan username atau email.
   * Secara eksplisit memilih field password karena di-select(false) di schema.
   */
  async findByIdentifier(identifier: string): Promise<IUser | null> {
    return User.findOne({
      $or: [
        { username: identifier.toLowerCase() },
        { email: identifier.toLowerCase() },
      ],
      isActive: true,
    }).select('+password');
  }

  /**
   * Cari admin by ID tanpa password (untuk response setelah login).
   */
  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).select('-password');
  }

  /**
   * Update waktu login terakhir admin.
   */
  async updateLastLogin(id: string): Promise<void> {
    await User.findByIdAndUpdate(id, { lastLogin: new Date() });
  }
}

export const authRepository = new AuthRepository();
