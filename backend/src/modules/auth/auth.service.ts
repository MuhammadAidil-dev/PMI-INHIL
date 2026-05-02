import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser } from '../users/user.type';
import { authRepository } from './auth.repository';
import { LoginPayload } from './auth.validation';
import { loadEnv } from '@/config/env';
import { AppError } from '@/common/error/appError';
import { ERROR_CODE, HTTP_CODE } from '@/common/error/httpCode';

const env = loadEnv();

interface LoginResult {
  admin: Omit<IUser, 'password'>;
  token: string;
}

/**
 * Service: berisi business logic autentikasi.
 * Memanggil repository untuk akses data, bukan langsung ke model.
 */
export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: SignOptions['expiresIn'];

  constructor() {
    if (!env.SECRET_KEY) {
      throw new Error('JWT_SECRET tidak ditemukan di environment variables');
    }
    this.JWT_SECRET = env.SECRET_KEY;
    // Cast ke SignOptions["expiresIn"] agar TypeScript tidak komplain
    this.JWT_EXPIRES_IN = (env.JWT_EXPIRES_IN ??
      '8h') as SignOptions['expiresIn'];
  }

  /**
   * Proses login admin:
   * 1. Cari admin di DB berdasarkan identifier
   * 2. Verifikasi password
   * 3. Generate JWT token
   * 4. Update last login
   */
  async login(payload: LoginPayload): Promise<LoginResult> {
    const { identifier, password } = payload;

    // 1. Cari admin
    const admin = await authRepository.findByIdentifier(identifier);
    if (!admin) {
      // Pesan generic agar tidak bocorkan info akun mana yang ada/tidak ada
      throw new AppError(
        'Invalid Credential',
        HTTP_CODE.UNAUTHORIZED,
        ERROR_CODE.UNAUTHORIZED,
      );
    }

    // 2. Verifikasi password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError(
        'Invalid Credential',
        HTTP_CODE.UNAUTHORIZED,
        ERROR_CODE.UNAUTHORIZED,
      );
    }

    // 3. Generate JWT
    const token = this.generateToken(admin);

    // 4. Update last login (fire and forget, tidak perlu await)
    authRepository
      .updateLastLogin(String(admin._id))
      .catch((err) => console.error('Gagal update lastLogin:', err));

    // Hapus password dari response
    const adminObject = admin.toObject();
    const { password: _pw, ...adminWithoutPassword } = adminObject;

    return {
      admin: adminWithoutPassword as Omit<IUser, 'password'>,
      token,
    };
  }

  private generateToken(admin: IUser): string {
    return jwt.sign(
      {
        sub: String(admin._id),
        username: admin.username,
        role: admin.role,
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN },
    );
  }
}

export const authService = new AuthService();
