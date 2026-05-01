import mongoose, { Schema } from 'mongoose';
import { INews } from './news.type';

const NewsSchema = new Schema<INews>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [255, 'Title must not exceed 255 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
NewsSchema.index({ isPublished: 1, publishedAt: -1 });
NewsSchema.index({ title: 'text', content: 'text' });

export const NewsModel = mongoose.model<INews>('News', NewsSchema);
