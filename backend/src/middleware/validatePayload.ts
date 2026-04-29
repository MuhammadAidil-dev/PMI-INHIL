import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { HTTP_CODE } from '@/common/error/httpCode';

/**
 * Generic validation middleware.
 * Terima Joi schema sebagai parameter, validasi req.body,
 * lalu simpan nilai yang sudah bersih ke res.locals.body
 * agar controller tinggal pakai tanpa validasi ulang.
 *
 * Contoh pemakaian di route:
 *   router.post('/login', validate(loginSchema), login);
 */
export const validate =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // validasi semua field, jangan berhenti di error pertama
      stripUnknown: true, // buang field yang tidak ada di schema
    });

    if (error) {
      // Ubah array detail error menjadi object { field: message }
      // Contoh: { identifier: "Username atau email wajib diisi", password: "Password wajib diisi" }
      const errors = error.details.reduce<Record<string, string>>(
        (acc, detail) => {
          // detail.path bisa nested, misal ['address', 'city'] → 'address.city'
          const field = detail.path.join('.');
          // Ambil error pertama per field saja agar tidak redundant
          if (!acc[field]) acc[field] = detail.message;
          return acc;
        },
        {},
      );

      res.status(HTTP_CODE.BAD_REQUEST).json({
        success: false,
        message: 'Validasi gagal',
        errors,
      });
      return;
    }

    // Simpan body yang sudah divalidasi & dibersihkan ke res.locals
    res.locals.body = value;
    next();
  };
