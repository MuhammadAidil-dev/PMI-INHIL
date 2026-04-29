import mongoose from 'mongoose';
import { BloodStockModel } from './bloodStock.model';
import { BloodStockLean, BloodType, RhesusType } from './bloodStock.type';

const ALL_BLOOD_COMBINATIONS: { bloodType: BloodType; rhesus: RhesusType }[] = [
  { bloodType: 'A', rhesus: '+' },
  { bloodType: 'A', rhesus: '-' },
  { bloodType: 'B', rhesus: '+' },
  { bloodType: 'B', rhesus: '-' },
  { bloodType: 'AB', rhesus: '+' },
  { bloodType: 'AB', rhesus: '-' },
  { bloodType: 'O', rhesus: '+' },
  { bloodType: 'O', rhesus: '-' },
];

class BloodStockRepository {
  /**
   * Inisialisasi semua 8 golongan darah dengan stok 0.
   * Idempotent: duplicate key (11000) diabaikan, aman dijalankan ulang.
   */
  async initAllBloodTypes(
    adminId: string,
    minThreshold: number,
  ): Promise<void> {
    const docs = ALL_BLOOD_COMBINATIONS.map((combo) => ({
      ...combo,
      totalBags: 0,
      minThreshold,
      lastUpdated: new Date(),
      updatedBy: new mongoose.Types.ObjectId(adminId),
    }));

    await BloodStockModel.insertMany(docs, { ordered: false }).catch((err) => {
      if (err.code !== 11000) throw err;
    });
  }

  /**
   * Ambil semua stok darah, diurutkan berdasarkan golongan.
   */
  async findAll(): Promise<BloodStockLean[]> {
    return BloodStockModel.find()
      .sort({ bloodType: 1, rhesus: 1 })
      .populate('updatedBy', 'username')
      .lean({ virtuals: true });
  }

  /**
   * Cari stok berdasarkan golongan darah + rhesus.
   */
  async findOne(
    bloodType: BloodType,
    rhesus: RhesusType,
  ): Promise<BloodStockLean | null> {
    return BloodStockModel.findOne({ bloodType, rhesus })
      .populate('updatedBy', 'username')
      .lean({ virtuals: true });
  }

  /**
   * Ambil daftar stok yang kritis (totalBags <= minThreshold).
   * Pakai $expr agar bisa compare dua field dalam satu dokumen.
   */
  async findCritical(): Promise<BloodStockLean[]> {
    return BloodStockModel.find({
      $expr: { $lte: ['$totalBags', '$minThreshold'] },
    })
      .sort({ totalBags: 1 })
      .lean({ virtuals: true });
  }

  /**
   * Update jumlah kantong secara atomik dengan $inc.
   * delta positif = tambah, negatif = kurangi.
   * Mengembalikan dokumen SETELAH update (new: true).
   */
  async incrementStock(
    bloodType: BloodType,
    rhesus: RhesusType,
    delta: number,
    adminId: string,
  ): Promise<BloodStockLean | null> {
    return BloodStockModel.findOneAndUpdate(
      { bloodType, rhesus },
      {
        $inc: { totalBags: delta },
        $set: {
          lastUpdated: new Date(),
          updatedBy: new mongoose.Types.ObjectId(adminId),
        },
      },
      { new: true, runValidators: true },
    ).lean({ virtuals: true });
  }

  /**
   * Update minimum threshold untuk golongan darah tertentu.
   */
  async updateThreshold(
    bloodType: BloodType,
    rhesus: RhesusType,
    minThreshold: number,
    adminId: string,
  ): Promise<BloodStockLean | null> {
    return BloodStockModel.findOneAndUpdate(
      { bloodType, rhesus },
      {
        $set: {
          minThreshold,
          lastUpdated: new Date(),
          updatedBy: new mongoose.Types.ObjectId(adminId),
        },
      },
      { new: true, runValidators: true },
    ).lean({ virtuals: true });
  }
}

export const bloodStockRepository = new BloodStockRepository();
