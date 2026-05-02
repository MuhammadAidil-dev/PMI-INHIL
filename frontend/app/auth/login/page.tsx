import { LoginForm } from '@/features/auth/components/form/LoginForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-2xl text-white">
            🩸
          </div>
          <h1 className="text-2xl font-bold text-gray-900">PMI Inhil</h1>
          <p className="mt-1 text-sm text-gray-500">
            Sistem Informasi Donor &amp; Stok Darah
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-gray-200 bg-white px-8 py-8 shadow-sm">
          <h2 className="mb-6 text-base font-semibold text-gray-800">
            Masuk ke Akun Anda
          </h2>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
