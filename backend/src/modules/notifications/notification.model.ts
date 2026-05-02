import mongoose, { Schema } from 'mongoose';
import {
  INotification,
  NotificationStatus,
  NotificationTrigger,
  NotificationType,
} from './notification.type';

const notificationSchema = new Schema<INotification>(
  {
    donorId: {
      type: Schema.Types.ObjectId,
      ref: 'Donor',
      required: true,
      index: true,
    },
    donorName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    trigger: {
      type: String,
      enum: Object.values(NotificationTrigger),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(NotificationStatus),
      default: NotificationStatus.PENDING,
    },
    fonnteResponse: { type: String, default: null },
    errorMessage: { type: String, default: null },
    sentAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

// Index untuk query log (filter by status, date range)
notificationSchema.index({ status: 1, createdAt: -1 });
notificationSchema.index({ donorId: 1, createdAt: -1 });
notificationSchema.index({ trigger: 1, createdAt: -1 });

export const NotificationModel = mongoose.model<INotification>(
  'Notification',
  notificationSchema,
);
