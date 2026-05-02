import mongoose, { Schema } from 'mongoose';
import { BloodType, DonorStatus, Gender, IDonor } from './donor.type';

const donorSchema = new Schema<IDonor>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    nik: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\d{16}$/, 'NIK harus 16 digit angka'],
    },
    gender: { type: String, enum: Object.values(Gender), required: true },
    birthDate: { type: Date, required: true },
    address: { type: String, required: true, trim: true },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^(08|628)\d{8,11}$/, 'Format nomor WA tidak valid'],
    },
    bloodType: { type: String, enum: Object.values(BloodType), required: true },
    weight: { type: Number, required: true, min: 45 },
    hemoglobin: { type: Number, min: 0 },

    status: {
      type: String,
      enum: Object.values(DonorStatus),
      default: DonorStatus.INACTIVE,
    }, // status donor
    totalDonations: { type: Number, default: 0, min: 0 },
    lastDonationDate: { type: Date, default: null },
    nextEligibleDate: { type: Date, default: null },
    lastNotificationSentAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true }, // status data untuk soft delete
  },
  { timestamps: true, versionKey: false, toJSON: { virtuals: true } },
);

// Indexes untuk query yang sering dipakai
donorSchema.index({ bloodType: 1, status: 1 });
donorSchema.index({ nextEligibleDate: 1 });

// ── Methods ──────────────────────────────────────────────────────────────────

donorSchema.methods.isEligible = function (): boolean {
  if (!this.lastDonationDate) return true; // belum pernah donor → eligible
  return new Date() >= this.nextEligibleDate;
};

donorSchema.methods.getDaysUntilEligible = function (): number {
  if (!this.nextEligibleDate) return 0;
  const diff = this.nextEligibleDate.getTime() - Date.now();
  return diff <= 0 ? 0 : Math.ceil(diff / 86_400_000);
};

// ── Pre-save: hitung nextEligibleDate & status otomatis ──────────────────────

donorSchema.pre('save', function (next) {
  if (this.isModified('lastDonationDate') && this.lastDonationDate) {
    // Berapa hari masa cooldown donor
    const DONOR_COOLDOWN_DAYS = 90;

    const eligibleDate = new Date(this.lastDonationDate);
    eligibleDate.setDate(eligibleDate.getDate() + DONOR_COOLDOWN_DAYS);
    this.nextEligibleDate = eligibleDate;
    this.status =
      Date.now() >= eligibleDate.getTime()
        ? DonorStatus.ACTIVE
        : DonorStatus.COOLDOWN;
  }
  next();
});

export const DonorModel = mongoose.model<IDonor>('Donor', donorSchema);
