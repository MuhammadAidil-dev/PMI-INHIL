import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from './user.type';

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username wajib diisi'],
      unique: true,
      trim: true,
      minlength: [3, 'Username minimal 3 karakter'],
    },
    email: {
      type: String,
      required: [true, 'Email wajib diisi'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Format email tidak valid'],
    },
    password: {
      type: String,
      required: [true, 'Password wajib diisi'],
      minlength: [8, 'Password minimal 8 karakter'],
      select: false, // password tidak ikut ter-query secara default
    },
    role: {
      type: String,
      enum: ['admin', 'superadmin'],
      default: 'admin',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Hash password sebelum disimpan
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method untuk membandingkan password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
