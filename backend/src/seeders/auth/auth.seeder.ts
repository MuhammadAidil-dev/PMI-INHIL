import { connectDb, disconnectDB } from '@/config/db.config';
import { User } from '@/modules/users/user.model'; // sesuaikan path jika berbeda
import { IUser } from '@/modules/users/user.type'; // sesuaikan path jika berbeda

// ─── Data seed ───────────────────────────────────────────────────────────────

interface AdminSeed {
  username: string;
  email: string;
  password: string;
  role: IUser['role'];
  isActive: boolean;
}

const adminSeeds: AdminSeed[] = [
  {
    username: 'superadmin',
    email: 'superadmin@pmi-inhil.com',
    password: 'SuperAdmin@123',
    role: 'superadmin',
    isActive: true,
  },
  {
    username: 'admin_pmi',
    email: 'admin@pmi-inhil.com',
    password: 'Admin@123456',
    role: 'admin',
    isActive: true,
  },
];

// ─── Seeder ───────────────────────────────────────────────────────────────────

const seed = async (): Promise<void> => {
  console.log('\n🌱 Memulai proses seeding admin...\n');

  let created = 0;
  let skipped = 0;

  for (const data of adminSeeds) {
    const exists = await User.findOne({
      $or: [{ username: data.username }, { email: data.email }],
    });

    if (exists) {
      console.log(`⚠️  Dilewati: "${data.username}" sudah ada di database`);
      skipped++;
      continue;
    }

    // Password di-hash otomatis oleh pre-save hook di UserSchema
    await User.create(data);
    console.log(`✅ Dibuat   : "${data.username}" (${data.role})`);
    created++;
  }

  console.log(`\n📊 Hasil seeding:`);
  console.log(`   - Dibuat  : ${created} admin`);
  console.log(`   - Dilewati: ${skipped} admin`);
};

// ─── Clear (hanya development) ────────────────────────────────────────────────

const clear = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      '❌ Perintah clear tidak diizinkan di environment production!',
    );
  }

  const { deletedCount } = await User.deleteMany({
    role: { $in: ['admin', 'superadmin'] },
  });
  console.log(
    `\n🗑️  ${deletedCount} data admin berhasil dihapus dari database`,
  );
};

// ─── Entry point ─────────────────────────────────────────────────────────────

const run = async (): Promise<void> => {
  const arg = process.argv[2]; // "seed" | "clear"

  try {
    await connectDb();

    if (arg === 'clear') {
      await clear();
    } else {
      await seed();
    }
  } catch (err) {
    console.error('\n❌ Seeder gagal:', (err as Error).message);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
};

run();
