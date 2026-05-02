import Joi from 'joi';

export const generateSlug = (title: string): string => {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') +
    '-' +
    Date.now()
  );
};

export const createNewsSchema = Joi.object({
  title: Joi.string().max(255).required().messages({
    'string.empty': 'Title is required',
    'string.max': 'Title must not exceed 255 characters',
    'any.required': 'Title is required',
  }),
  content: Joi.string().required().messages({
    'string.empty': 'Content is required',
    'any.required': 'Content is required',
  }),
  isPublished: Joi.boolean().default(false),
});

export const updateNewsSchema = Joi.object({
  title: Joi.string().max(255).optional().messages({
    'string.max': 'Title must not exceed 255 characters',
  }),
  content: Joi.string().optional(),
  isPublished: Joi.boolean().optional(),
}).min(1);

export const togglePublishSchema = Joi.object({
  isPublished: Joi.boolean().required().messages({
    'any.required': 'Published status is required',
  }),
});
