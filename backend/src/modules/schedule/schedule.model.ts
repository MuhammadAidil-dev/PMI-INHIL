import mongoose, { Schema } from 'mongoose';
import { ISchedule } from './schedule.type';

const ScheduleSchema = new Schema<ISchedule>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    endTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    donorQuota: {
      type: Number,
      required: true,
      min: 1,
      default: 50,
    },
    registeredDonors: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Index for public queries (upcoming schedules)
ScheduleSchema.index({ date: 1, status: 1 });
// Index for text search by location and title
ScheduleSchema.index({ location: 'text', title: 'text' });

export const ScheduleModel = mongoose.model<ISchedule>(
  'Schedule',
  ScheduleSchema,
);
