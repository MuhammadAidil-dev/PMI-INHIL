import mongoose, { Document } from 'mongoose';

export interface INews {
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  isPublished: boolean;
  publishedAt: Date | null;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type INewsDocument = INews & Document;

export interface NewsFilter {
  isPublished?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
