import { Request, Response } from 'express';
import { newsService } from './news.service';
import { HTTP_CODE } from '@/common/error/httpCode';

/**
 * GET /api/news
 * Query params: page, limit, search, isPublished
 */
export const getAllNews = async (req: Request, res: Response) => {
  const {
    page = '1',
    limit = '10',
    search,
    isPublished,
  } = req.query as Record<string, string>;

  const result = await newsService.getAll({
    page: parseInt(page),
    limit: parseInt(limit),
    search,
    // convert string query → boolean (undefined = no filter)
    isPublished:
      isPublished === 'true'
        ? true
        : isPublished === 'false'
          ? false
          : undefined,
  });

  res.status(HTTP_CODE.OK).json({
    success: true,
    message: 'News retrieved successfully',
    data: result,
  });
};

/**
 * GET /api/news/:id
 */
export const getNewsById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const news = await newsService.getById(id);

  res.status(HTTP_CODE.OK).json({
    success: true,
    message: 'News retrieved successfully',
    data: news,
  });
};

/**
 * POST /api/news
 * Body validated via middleware → available at res.locals.body
 * Image URL comes from upload middleware → available at req.file
 */
export const createNews = async (req: Request, res: Response) => {
  const { title, content, isPublished } = res.locals.body;
  const adminId = (req as any).admin._id.toString();

  // imageUrl from multer upload middleware (optional)
  const imageUrl = (req as any).file
    ? `/uploads/news/${(req as any).file.filename}`
    : '';

  const news = await newsService.create(
    { title, content, isPublished, imageUrl },
    adminId,
  );

  res.status(HTTP_CODE.CREATED).json({
    success: true,
    message: 'News created successfully',
    data: news,
  });
};

/**
 * PUT /api/news/:id
 * Supports partial update (title, content, isPublished, image)
 */
export const updateNews = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, isPublished } = res.locals.body;

  const imageUrl = (req as any).file
    ? `/uploads/news/${(req as any).file.filename}`
    : undefined; // undefined = don't overwrite existing image

  const news = await newsService.update(id, {
    title,
    content,
    isPublished,
    imageUrl,
  });

  res.status(HTTP_CODE.OK).json({
    success: true,
    message: 'News updated successfully',
    data: news,
  });
};

/**
 * DELETE /api/news/:id
 */
export const deleteNews = async (req: Request, res: Response) => {
  const { id } = req.params;

  await newsService.remove(id);

  res.status(HTTP_CODE.OK).json({
    success: true,
    message: 'News deleted successfully',
    data: null,
  });
};

/**
 * PATCH /api/news/:id/publish
 * Body: { isPublished: boolean }
 */
export const toggleNewsPublish = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isPublished } = res.locals.body;

  const news = await newsService.togglePublish(id, isPublished);

  res.status(HTTP_CODE.OK).json({
    success: true,
    message: `News ${isPublished ? 'published' : 'unpublished'} successfully`,
    data: news,
  });
};
