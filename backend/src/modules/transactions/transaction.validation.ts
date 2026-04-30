import Joi from 'joi';
import {
  BloodComponent,
  TransactionStatus,
  TransactionType,
} from './transaction.type';

const BLOOD_TYPES = ['A', 'B', 'AB', 'O'];
const RHESUS_TYPES = ['+', '-'];
const COMPONENTS = Object.values(BloodComponent);

// ── Reusable fields ───────────────────────────────────────────────────────────

const bloodTypeField = Joi.string()
  .valid(...BLOOD_TYPES)
  .required()
  .messages({
    'any.only': `Golongan darah harus salah satu dari: ${BLOOD_TYPES.join(', ')}`,
    'any.required': 'Golongan darah wajib diisi',
  });

const rhesusField = Joi.string()
  .valid(...RHESUS_TYPES)
  .required()
  .messages({
    'any.only': 'Rhesus harus "+" atau "-"',
    'any.required': 'Rhesus wajib diisi',
  });

const componentField = Joi.string()
  .valid(...COMPONENTS)
  .required()
  .messages({
    'any.only': `Komponen harus salah satu dari: ${COMPONENTS.join(', ')}`,
    'any.required': 'Komponen darah wajib diisi',
  });

const quantityField = Joi.number().integer().min(1).required().messages({
  'number.base': 'Jumlah kantong harus berupa angka',
  'number.integer': 'Jumlah kantong harus bilangan bulat',
  'number.min': 'Jumlah kantong minimal 1',
  'any.required': 'Jumlah kantong wajib diisi',
});

const phoneField = Joi.string()
  .pattern(/^(\+62|62|0)[0-9]{8,13}$/)
  .optional()
  .allow('', null)
  .messages({ 'string.pattern.base': 'Format nomor telepon tidak valid' });

const isoDateField = Joi.string().isoDate().optional().messages({
  'string.isoDate': 'Format tanggal tidak valid (gunakan ISO 8601)',
});

// ── Transaksi Masuk (Donor) ───────────────────────────────────────────────────

export const createTransactionInSchema = Joi.object({
  donorId: Joi.string().hex().length(24).required().messages({
    'string.hex': 'donorId tidak valid',
    'string.length': 'donorId tidak valid',
    'any.required': 'donorId wajib diisi',
  }),
  bloodType: bloodTypeField,
  rhesus: rhesusField,
  component: componentField,
  quantity: quantityField,
  notes: Joi.string().max(500).optional().allow('', null),
  transactionDate: isoDateField,
});

// ── Transaksi Keluar (Distribusi) ─────────────────────────────────────────────

export const createTransactionOutSchema = Joi.object({
  bloodType: bloodTypeField,
  rhesus: rhesusField,
  component: componentField,
  quantity: quantityField,
  recipientName: Joi.string().min(2).max(100).required().messages({
    'any.required': 'Nama penerima wajib diisi',
    'string.min': 'Nama penerima minimal 2 karakter',
  }),
  recipientHospital: Joi.string().min(2).max(150).required().messages({
    'any.required': 'Nama rumah sakit / instansi wajib diisi',
    'string.min': 'Nama instansi minimal 2 karakter',
  }),
  recipientPhone: phoneField,
  notes: Joi.string().max(500).optional().allow('', null),
  transactionDate: isoDateField,
});

// ── Update ────────────────────────────────────────────────────────────────────

export const updateTransactionSchema = Joi.object({
  notes: Joi.string().max(500).optional().allow('', null),
  recipientName: Joi.string().min(2).max(100).optional().allow('', null),
  recipientHospital: Joi.string().min(2).max(150).optional().allow('', null),
  recipientPhone: phoneField,
})
  .min(1)
  .messages({
    'object.min': 'Minimal satu field harus diisi',
  });

// ── Query Params ──────────────────────────────────────────────────────────────

export const queryTransactionSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  type: Joi.string()
    .valid(...Object.values(TransactionType))
    .optional(),
  bloodType: Joi.string()
    .valid(...BLOOD_TYPES)
    .optional(),
  rhesus: Joi.string()
    .valid(...RHESUS_TYPES)
    .optional(),
  component: Joi.string()
    .valid(...COMPONENTS)
    .optional(),
  status: Joi.string()
    .valid(...Object.values(TransactionStatus))
    .optional(),
  donorId: Joi.string().hex().length(24).optional(),
  startDate: isoDateField,
  endDate: isoDateField,
  search: Joi.string().max(100).optional().allow(''),
});
