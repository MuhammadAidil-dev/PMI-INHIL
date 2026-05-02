import mongoose, { Schema } from 'mongoose';
import {
  BloodComponent,
  ITransaction,
  TransactionStatus,
  TransactionType,
} from './transaction.type';

const BLOOD_TYPES = ['A', 'B', 'AB', 'O'];
const RHESUS_TYPES = ['+', '-'];

const TransactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },

    // ── Darah Masuk ──────────────────────────────────────────────────────────
    donorId: {
      type: Schema.Types.ObjectId,
      ref: 'Donor',
      default: null,
    },
    donorName: {
      type: String,
      default: null,
      trim: true,
    },

    // ── Detail Darah ─────────────────────────────────────────────────────────
    bloodType: {
      type: String,
      enum: BLOOD_TYPES,
      required: true,
    },
    rhesus: {
      type: String,
      enum: RHESUS_TYPES,
      required: true,
    },
    component: {
      type: String,
      enum: Object.values(BloodComponent),
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Jumlah kantong minimal 1'],
    },

    // ── Darah Keluar ─────────────────────────────────────────────────────────
    recipientName: { type: String, default: null, trim: true },
    recipientHospital: { type: String, default: null, trim: true },
    recipientPhone: { type: String, default: null, trim: true },

    notes: { type: String, default: null, trim: true },

    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.COMPLETED,
    },

    transactionDate: {
      type: Date,
      default: () => new Date(),
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

// ── Indexes ───────────────────────────────────────────────────────────────────
TransactionSchema.index({ bloodType: 1, rhesus: 1 });
TransactionSchema.index({ donorId: 1 });
TransactionSchema.index({ transactionDate: -1 });
TransactionSchema.index({ type: 1, status: 1 });

export const TransactionModel = mongoose.model<ITransaction>(
  'Transaction',
  TransactionSchema,
);
