import Joi from 'joi';
import { BloodType, DonorStatus, Gender } from './donor.type';

const bloodTypeValues = Object.values(BloodType);
const genderValues = Object.values(Gender);
const statusValues = Object.values(DonorStatus);

// ── Create ────────────────────────────────────────────────────────────────────

export const createDonorSchema = Joi.object({
  fullName: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Nama minimal 3 karakter',
    'any.required': 'Nama lengkap wajib diisi',
  }),
  nik: Joi.string()
    .pattern(/^\d{16}$/)
    .required()
    .messages({
      'string.pattern.base': 'NIK harus 16 digit angka',
      'any.required': 'NIK wajib diisi',
    }),
  gender: Joi.string()
    .valid(...genderValues)
    .required()
    .messages({
      'any.only': `Jenis kelamin harus salah satu dari: ${genderValues.join(', ')}`,
      'any.required': 'Jenis kelamin wajib diisi',
    }),
  birthDate: Joi.date().iso().max('now').required().messages({
    'date.max': 'Tanggal lahir tidak boleh di masa depan',
    'any.required': 'Tanggal lahir wajib diisi',
  }),
  address: Joi.string().min(10).required().messages({
    'any.required': 'Alamat wajib diisi',
  }),
  phone: Joi.string()
    .pattern(/^(08|628)\d{8,11}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Format nomor WA tidak valid (contoh: 08123456789)',
      'any.required': 'Nomor WhatsApp wajib diisi',
    }),
  bloodType: Joi.string()
    .valid(...bloodTypeValues)
    .required()
    .messages({
      'any.only': `Golongan darah harus salah satu dari: ${bloodTypeValues.join(', ')}`,
      'any.required': 'Golongan darah wajib diisi',
    }),
  weight: Joi.number().min(45).required().messages({
    'number.min': 'Berat badan minimal 45 kg untuk donor',
    'any.required': 'Berat badan wajib diisi',
  }),
  hemoglobin: Joi.number().min(0).optional(),
});

// ── Update ────────────────────────────────────────────────────────────────────

export const updateDonorSchema = Joi.object({
  fullName: Joi.string().min(3).max(100).optional(),
  gender: Joi.string()
    .valid(...genderValues)
    .optional(),
  birthDate: Joi.date().iso().max('now').optional(),
  address: Joi.string().min(10).optional(),
  phone: Joi.string()
    .pattern(/^(08|628)\d{8,11}$/)
    .optional(),
  bloodType: Joi.string()
    .valid(...bloodTypeValues)
    .optional(),
  weight: Joi.number().min(45).optional(),
  hemoglobin: Joi.number().min(0).optional(),
  isActive: Joi.boolean().optional(),
})
  .min(1)
  .messages({
    'object.min': 'Minimal satu field harus diisi untuk update',
  });

// ── Query ─────────────────────────────────────────────────────────────────────

export const queryDonorSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().optional(),
  bloodType: Joi.string()
    .valid(...bloodTypeValues)
    .optional(),
  status: Joi.string()
    .valid(...statusValues)
    .optional(),
  isActive: Joi.boolean().optional(),
});
