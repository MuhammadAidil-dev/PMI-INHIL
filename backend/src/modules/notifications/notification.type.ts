import { Document, Types } from 'mongoose';

// ── Enums ─────────────────────────────────────────────────────────────────────

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
}

export enum NotificationTrigger {
  MANUAL = 'manual', // dikirim manual oleh admin
  SCHEDULED = 'scheduled', // dikirim otomatis oleh cron job
  POST_DONATION = 'post_donation', // dikirim setelah transaksi donor dicatat
}

export enum NotificationType {
  ELIGIBLE_REMINDER = 'eligible_reminder', // pendonor sudah bisa donor lagi
  POST_DONATION_THANKS = 'post_donation_thanks', // ucapan terima kasih setelah donor
  CUSTOM = 'custom', // pesan custom dari admin
}

// ── MongoDB Document Interface ────────────────────────────────────────────────

export interface INotification {
  _id: Types.ObjectId;
  donorId: Types.ObjectId;
  donorName: string;
  phone: string;
  message: string;
  type: NotificationType;
  trigger: NotificationTrigger;
  status: NotificationStatus;
  fonnteResponse?: string; // response mentah dari Fonnte
  errorMessage?: string;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationDocument = INotification & Document;

// ── DTOs ──────────────────────────────────────────────────────────────────────

export interface SendManualNotificationDto {
  donorIds: string[]; // bisa kirim ke banyak sekaligus
  message: string;
}

export interface SendSingleNotificationDto {
  donorId: string;
  message: string;
  type: NotificationType;
  trigger: NotificationTrigger;
}

// ── Response ──────────────────────────────────────────────────────────────────

export interface NotificationResponse {
  id: string;
  donorId: string;
  donorName: string;
  phone: string;
  message: string;
  type: NotificationType;
  trigger: NotificationTrigger;
  status: NotificationStatus;
  errorMessage?: string;
  sentAt?: string | null;
  createdAt: string;
}

export interface BulkSendResult {
  total: number;
  success: number;
  failed: number;
  results: Array<{
    donorId: string;
    donorName: string;
    phone: string;
    status: NotificationStatus;
    errorMessage?: string;
  }>;
}

export interface QueryNotificationDto {
  page?: number;
  limit?: number;
  donorId?: string;
  status?: NotificationStatus;
  type?: NotificationType;
  trigger?: NotificationTrigger;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedNotificationResponse {
  data: NotificationResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ── Fonnte API ────────────────────────────────────────────────────────────────

export interface FonntePayload {
  target: string; // nomor tujuan, format: 628xxxx
  message: string;
  countryCode?: string;
}

export interface FonnteResponse {
  status: boolean;
  target?: string;
  message?: string;
  id?: string;
}
