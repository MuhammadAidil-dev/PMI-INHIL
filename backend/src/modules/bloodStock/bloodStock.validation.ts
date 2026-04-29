import Joi from 'joi';

const bloodTypeValues = ['A', 'B', 'AB', 'O'];
const rhesusValues = ['+', '-'];

// Schema untuk inisialisasi stok darah (seed awal semua golongan)
// Biasanya dipakai superadmin satu kali saat setup
export const initStockSchema = Joi.object({
  minThreshold: Joi.number().integer().min(0).default(10).messages({
    'number.base': 'minThreshold harus berupa angka',
    'number.min': 'minThreshold tidak boleh negatif',
  }),
});

// Schema untuk update stok secara manual (koreksi/penyesuaian oleh admin)
// Contoh kasus: kantong darah kadaluarsa atau rusak → admin kurangi manual
export const adjustStockSchema = Joi.object({
  bloodType: Joi.string()
    .valid(...bloodTypeValues)
    .required()
    .messages({
      'any.only': `Golongan darah harus salah satu dari: ${bloodTypeValues.join(', ')}`,
      'any.required': 'Golongan darah wajib diisi',
    }),
  rhesus: Joi.string()
    .valid(...rhesusValues)
    .required()
    .messages({
      'any.only': 'Rhesus harus + atau -',
      'any.required': 'Rhesus wajib diisi',
    }),
  adjustment: Joi.number().integer().not(0).required().messages({
    'number.base': 'Penyesuaian harus berupa angka',
    'any.invalid': 'Penyesuaian tidak boleh 0',
    'any.required': 'Nilai penyesuaian wajib diisi',
  }),
  reason: Joi.string().trim().min(5).max(255).required().messages({
    'string.min': 'Alasan minimal 5 karakter',
    'string.max': 'Alasan maksimal 255 karakter',
    'any.required': 'Alasan penyesuaian wajib diisi',
  }),
});

// Schema untuk update minimum threshold per golongan
export const updateThresholdSchema = Joi.object({
  bloodType: Joi.string()
    .valid(...bloodTypeValues)
    .required()
    .messages({
      'any.only': `Golongan darah harus salah satu dari: ${bloodTypeValues.join(', ')}`,
      'any.required': 'Golongan darah wajib diisi',
    }),
  rhesus: Joi.string()
    .valid(...rhesusValues)
    .required()
    .messages({
      'any.only': 'Rhesus harus + atau -',
      'any.required': 'Rhesus wajib diisi',
    }),
  minThreshold: Joi.number().integer().min(0).required().messages({
    'number.base': 'minThreshold harus berupa angka',
    'number.min': 'minThreshold tidak boleh negatif',
    'any.required': 'minThreshold wajib diisi',
  }),
});
