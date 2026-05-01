import { AppError } from '@/common/error/appError';
import { ERROR_CODE, HTTP_CODE } from '@/common/error/httpCode';
import { newsRepository } from './news.repository';
import { generateSlug } from './news.validation';
import { INews, NewsFilter, PaginatedResult } from './news.type';
import { deleteImageFile } from '@/common/utils/lib-utils';

/**
 * Delete image file from disk.
 * imageUrl stored in DB is a relative path e.g. "/uploads/news/news-xxx.jpg"
 * We resolve it against the "public" folder at project root.
 * Silently ignores missing files — no need to crash if file is already gone.
 */

const getAll = async (filter: NewsFilter): Promise<PaginatedResult<INews>> => {
  return newsRepository.findAll(filter);
};

const getById = async (id: string): Promise<INews> => {
  const news = await newsRepository.findById(id);

  if (!news) {
    throw new AppError(
      'News not found',
      HTTP_CODE.NOT_FOUND,
      ERROR_CODE.NOT_FOUND,
    );
  }

  return news;
};

const create = async (
  payload: {
    title: string;
    content: string;
    isPublished?: boolean;
    imageUrl?: string;
  },
  adminId: string,
): Promise<INews> => {
  const slug = generateSlug(payload.title);

  // Guard: slug collision (extremely rare but safe)
  const existing = await newsRepository.findBySlug(slug);
  if (existing) {
    throw new AppError(
      'News with a similar title already exists',
      HTTP_CODE.CONFLICT,
      ERROR_CODE.DUPLICATE_KEY,
    );
  }

  const news = await newsRepository.create({
    title: payload.title,
    slug,
    content: payload.content,
    imageUrl: payload.imageUrl ?? '',
    isPublished: payload.isPublished ?? false,
    publishedAt: payload.isPublished ? new Date() : null,
    createdBy: adminId as any,
  });

  return news;
};

const update = async (
  id: string,
  payload: {
    title?: string;
    content?: string;
    isPublished?: boolean;
    imageUrl?: string;
  },
): Promise<INews> => {
  const existing = await newsRepository.findById(id);
  if (!existing) {
    throw new AppError(
      'News not found',
      HTTP_CODE.NOT_FOUND,
      ERROR_CODE.NOT_FOUND,
    );
  }

  // Delete old image from disk if a new image is being uploaded
  if (payload.imageUrl && existing.imageUrl) {
    deleteImageFile(existing.imageUrl);
  }

  // Regenerate slug only when title changes
  const updateData: Partial<INews> = {
    ...(payload.title && {
      title: payload.title,
      slug: generateSlug(payload.title),
    }),
    ...(payload.content !== undefined && { content: payload.content }),
    ...(payload.imageUrl !== undefined && { imageUrl: payload.imageUrl }),
    ...(payload.isPublished !== undefined && {
      isPublished: payload.isPublished,
      publishedAt: payload.isPublished
        ? (existing.publishedAt ?? new Date())
        : null,
    }),
  };

  const updated = await newsRepository.updateById(id, updateData);

  return updated!;
};

const remove = async (id: string): Promise<void> => {
  const existing = await newsRepository.findById(id);
  if (!existing) {
    throw new AppError(
      'News not found',
      HTTP_CODE.NOT_FOUND,
      ERROR_CODE.NOT_FOUND,
    );
  }

  // Delete image from disk before removing DB record
  if (existing.imageUrl) {
    deleteImageFile(existing.imageUrl);
  }

  await newsRepository.deleteById(id);
};

const togglePublish = async (
  id: string,
  isPublished: boolean,
): Promise<INews> => {
  const existing = await newsRepository.findById(id);
  if (!existing) {
    throw new AppError(
      'News not found',
      HTTP_CODE.NOT_FOUND,
      ERROR_CODE.NOT_FOUND,
    );
  }

  const updated = await newsRepository.togglePublish(id, isPublished);
  return updated!;
};

export const newsService = {
  getAll,
  getById,
  create,
  update,
  remove,
  togglePublish,
};
