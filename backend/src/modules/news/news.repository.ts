import { INews, NewsFilter, PaginatedResult } from './news.type';
import { NewsModel } from './news.model';
import mongoose from 'mongoose';

const findAll = async (filter: NewsFilter): Promise<PaginatedResult<INews>> => {
  const { isPublished, search, page = 1, limit = 10 } = filter;

  const query: mongoose.FilterQuery<INews> = {};

  if (typeof isPublished === 'boolean') {
    query.isPublished = isPublished;
  }

  if (search && search.trim() !== '') {
    query.$text = { $search: search.trim() };
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    NewsModel.find(query)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    NewsModel.countDocuments(query),
  ]);

  return {
    data: data as INews[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const findById = async (id: string): Promise<INews | null> => {
  return NewsModel.findById(id)
    .populate('createdBy', 'username')
    .lean() as Promise<INews | null>;
};

const findBySlug = async (slug: string): Promise<INews | null> => {
  return NewsModel.findOne({ slug }).lean() as Promise<INews | null>;
};

const create = async (payload: Partial<INews>): Promise<INews> => {
  const news = new NewsModel(payload);
  return news.save();
};

const updateById = async (
  id: string,
  payload: Partial<INews>,
): Promise<INews | null> => {
  return NewsModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean() as Promise<INews | null>;
};

const deleteById = async (id: string): Promise<INews | null> => {
  return NewsModel.findByIdAndDelete(id).lean() as Promise<INews | null>;
};

const togglePublish = async (
  id: string,
  isPublished: boolean,
): Promise<INews | null> => {
  return NewsModel.findByIdAndUpdate(
    id,
    {
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
    { new: true },
  ).lean<INews | null>();
};

export const newsRepository = {
  findAll,
  findById,
  findBySlug,
  create,
  updateById,
  deleteById,
  togglePublish,
};
