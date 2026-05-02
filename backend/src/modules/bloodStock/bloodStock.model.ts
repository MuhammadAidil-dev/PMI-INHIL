import mongoose, { Schema } from 'mongoose';
import { IBloodStock } from './bloodStock.type';

const BloodStockSchema = new Schema<IBloodStock>(
  {
    bloodType: {
      type: String,
      enum: ['A', 'B', 'AB', 'O'],
      required: true,
    },
    rhesus: {
      type: String,
      enum: ['+', '-'],
      required: true,
    },
    totalBags: {
      type: Number,
      default: 0,
      min: [0, 'Jumlah kantong tidak boleh negatif'],
    },
    minThreshold: {
      type: Number,
      default: 10, // default alert di bawah 10 kantong
      min: [0, 'Minimum threshold tidak boleh negatif'],
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    // Pastikan kombinasi bloodType + rhesus unik (misal: A+ hanya 1 dokumen)
    // Compound unique index didefinisikan di bawah
  },
);

// Compound unique index: tidak boleh ada duplikasi A+ atau B-, dst.
BloodStockSchema.index({ bloodType: 1, rhesus: 1 }, { unique: true });

// Virtual untuk label lengkap, misal "A+"
BloodStockSchema.virtual('label').get(function () {
  return `${this.bloodType}${this.rhesus}`;
});

// Virtual: apakah stok kritis?
BloodStockSchema.virtual('isCritical').get(function () {
  return this.totalBags <= this.minThreshold;
});

BloodStockSchema.set('toJSON', { virtuals: true });
BloodStockSchema.set('toObject', { virtuals: true });

export const BloodStockModel = mongoose.model<IBloodStock>(
  'BloodStock',
  BloodStockSchema,
);
