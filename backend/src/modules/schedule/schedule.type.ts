import { Document, Types } from 'mongoose';

export type ScheduleStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

/**
 * Plain data shape — used everywhere outside of Mongoose internals
 * (service, controller, DTO comparisons, API responses).
 * Does NOT extend Document, so it is safe to use with .lean() results.
 */
export interface ISchedule {
  _id: Types.ObjectId;
  title: string;
  location: string;
  address: string;
  date: Date;
  startTime: string; // format "HH:mm"
  endTime: string; // format "HH:mm"
  donorQuota: number;
  registeredDonors: number;
  status: ScheduleStatus;
  notes?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose Document type — only used internally by the model/repository
 * when you need access to Mongoose instance methods (.save(), etc.).
 */
export type ScheduleDocument = ISchedule & Document;

export interface CreateScheduleDTO {
  title: string;
  location: string;
  address: string;
  date: Date;
  startTime: string;
  endTime: string;
  donorQuota: number;
  notes?: string;
  createdBy: string;
}

export interface UpdateScheduleDTO {
  title?: string;
  location?: string;
  address?: string;
  date?: Date;
  startTime?: string;
  endTime?: string;
  donorQuota?: number;
  notes?: string;
  status?: ScheduleStatus;
}
