import Joi from 'joi';

/**
 * Schema for creating a new donation schedule
 */
export const createScheduleSchema = Joi.object({
  title: Joi.string().trim().max(200).required().messages({
    'string.empty': 'Title is required',
    'string.max': 'Title must not exceed 200 characters',
    'any.required': 'Title is required',
  }),

  location: Joi.string().trim().max(200).required().messages({
    'string.empty': 'Location name is required',
    'string.max': 'Location must not exceed 200 characters',
    'any.required': 'Location name is required',
  }),

  address: Joi.string().trim().max(500).required().messages({
    'string.empty': 'Address is required',
    'string.max': 'Address must not exceed 500 characters',
    'any.required': 'Address is required',
  }),

  date: Joi.date().iso().required().messages({
    'date.base': 'Invalid date format',
    'date.format': 'Date must be in ISO format (YYYY-MM-DD)',
    'any.required': 'Date is required',
  }),

  startTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      'string.pattern.base':
        'Invalid start time format, use HH:mm (e.g. 08:00)',
      'any.required': 'Start time is required',
    }),

  endTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid end time format, use HH:mm (e.g. 15:00)',
      'any.required': 'End time is required',
    }),

  donorQuota: Joi.number().integer().min(1).max(10000).default(50).messages({
    'number.base': 'Donor quota must be a number',
    'number.min': 'Donor quota must be at least 1',
    'number.max': 'Donor quota must not exceed 10,000',
    'number.integer': 'Donor quota must be a whole number',
  }),

  notes: Joi.string().trim().max(1000).optional().allow('').messages({
    'string.max': 'Notes must not exceed 1000 characters',
  }),
});

/**
 * Schema for updating a donation schedule
 * All fields are optional
 */
export const updateScheduleSchema = Joi.object({
  title: Joi.string().trim().max(200).messages({
    'string.empty': 'Title must not be empty',
    'string.max': 'Title must not exceed 200 characters',
  }),

  location: Joi.string().trim().max(200).messages({
    'string.empty': 'Location must not be empty',
    'string.max': 'Location must not exceed 200 characters',
  }),

  address: Joi.string().trim().max(500).messages({
    'string.empty': 'Address must not be empty',
    'string.max': 'Address must not exceed 500 characters',
  }),

  date: Joi.date().iso().messages({
    'date.base': 'Invalid date format',
    'date.format': 'Date must be in ISO format (YYYY-MM-DD)',
  }),

  startTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .messages({
      'string.pattern.base':
        'Invalid start time format, use HH:mm (e.g. 08:00)',
    }),

  endTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .messages({
      'string.pattern.base': 'Invalid end time format, use HH:mm (e.g. 15:00)',
    }),

  donorQuota: Joi.number().integer().min(1).max(10000).messages({
    'number.base': 'Donor quota must be a number',
    'number.min': 'Donor quota must be at least 1',
    'number.max': 'Donor quota must not exceed 10,000',
    'number.integer': 'Donor quota must be a whole number',
  }),

  notes: Joi.string().trim().max(1000).optional().allow('').messages({
    'string.max': 'Notes must not exceed 1000 characters',
  }),

  status: Joi.string()
    .valid('upcoming', 'ongoing', 'completed', 'cancelled')
    .messages({
      'any.only':
        'Status must be one of: upcoming, ongoing, completed, cancelled',
    }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided to update',
  });

/**
 * Schema for query params filter (GET all)
 */
export const filterScheduleSchema = Joi.object({
  status: Joi.string()
    .valid('upcoming', 'ongoing', 'completed', 'cancelled')
    .optional(),
  dateFrom: Joi.date().iso().optional(),
  dateTo: Joi.date().iso().min(Joi.ref('dateFrom')).optional().messages({
    'date.min': 'End date filter must be after start date',
  }),
  search: Joi.string().trim().max(100).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});
