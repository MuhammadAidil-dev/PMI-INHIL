import Joi from 'joi';

export interface LoginPayload {
  identifier: string; // bisa username atau email
  password: string;
}

/**
 * Schema validasi untuk request body login admin.
 * Field `identifier` menerima username atau email.
 */
export const loginSchema = Joi.object<LoginPayload>({
  identifier: Joi.string().trim().min(3).max(100).required().messages({
    'string.base': 'Identifier harus berupa teks',
    'string.empty': 'Username atau email wajib diisi',
    'string.min': 'Identifier minimal 3 karakter',
    'string.max': 'Identifier maksimal 100 karakter',
    'any.required': 'Username atau email wajib diisi',
  }),

  password: Joi.string()
    .min(8)
    .max(72) // bcrypt max length
    .required()
    .messages({
      'string.base': 'Password harus berupa teks',
      'string.empty': 'Password wajib diisi',
      'string.min': 'Password minimal 8 karakter',
      'string.max': 'Password maksimal 72 karakter',
      'any.required': 'Password wajib diisi',
    }),
});
