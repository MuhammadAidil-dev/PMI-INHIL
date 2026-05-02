import Joi from 'joi';
import {
  NotificationStatus,
  NotificationTrigger,
  NotificationType,
} from './notification.type';

// Kirim notifikasi manual (bulk)
export const sendManualSchema = Joi.object({
  donorIds: Joi.array()
    .items(Joi.string().hex().length(24))
    .min(1)
    .required()
    .messages({
      'array.min': 'Minimal satu pendonor harus dipilih',
      'any.required': 'donorIds wajib diisi',
    }),
  message: Joi.string().min(5).max(1000).required().messages({
    'string.min': 'Pesan minimal 5 karakter',
    'string.max': 'Pesan maksimal 1000 karakter',
    'any.required': 'Pesan wajib diisi',
  }),
});

// Query log notifikasi
export const queryNotificationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  donorId: Joi.string().hex().length(24).optional(),
  status: Joi.string()
    .valid(...Object.values(NotificationStatus))
    .optional(),
  type: Joi.string()
    .valid(...Object.values(NotificationType))
    .optional(),
  trigger: Joi.string()
    .valid(...Object.values(NotificationTrigger))
    .optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional().messages({
    'date.min': 'endDate harus setelah startDate',
  }),
});
