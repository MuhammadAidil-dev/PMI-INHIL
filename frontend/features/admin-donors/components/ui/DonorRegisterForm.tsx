'use client';

import { useState } from 'react';
import { UserCircle2 } from 'lucide-react';
import { DonorFormField } from './DonorFormField';

const BLOOD_TYPES = ['A', 'B', 'AB', 'O'];

type FormData = {
  fullName: string;
  nik: string;
  bloodType: string;
  rhesus: 'positive' | 'negative' | '';
  gender: 'L' | 'P';
  birthPlace: string;
  birthDate: string;
  weight: string;
  hemoglobin: string;
  phone: string;
  address: string;
};

const INPUT_CLASS =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-neutral placeholder:text-tertiary/60 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none bg-white';

export function DonorRegisterForm() {
  const [form, setForm] = useState<FormData>({
    fullName: '',
    nik: '',
    bloodType: '',
    rhesus: '',
    gender: 'L',
    birthPlace: '',
    birthDate: '',
    weight: '',
    hemoglobin: '',
    phone: '',
    address: '',
  });

  const set = (key: keyof FormData) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect to donorService.create(form)
    console.log('Submit:', form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section header */}
      <div className="-mx-6 -mt-6 px-6 py-3 bg-secondary border-b border-gray-200 mb-6 flex items-center gap-2 rounded-t-xl">
        <UserCircle2 size={18} className="text-primary" />
        <span className="text-xs font-bold uppercase tracking-wider text-tertiary">
          Informasi Identitas
        </span>
      </div>

      {/* Nama + NIK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <DonorFormField label="Nama Lengkap" htmlFor="fullName">
          <input
            id="fullName"
            type="text"
            className={INPUT_CLASS}
            placeholder="Masukkan nama lengkap sesuai identitas"
            value={form.fullName}
            onChange={(e) => set('fullName')(e.target.value)}
            required
          />
        </DonorFormField>

        <DonorFormField label="Nomor Identitas (NIK)" htmlFor="nik">
          <input
            id="nik"
            type="text"
            inputMode="numeric"
            maxLength={16}
            className={INPUT_CLASS}
            placeholder="16 digit NIK"
            value={form.nik}
            onChange={(e) => set('nik')(e.target.value)}
            required
          />
        </DonorFormField>
      </div>

      {/* Golongan Darah + Rhesus + Jenis Kelamin */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <DonorFormField label="Golongan Darah" htmlFor="bloodType">
          <select
            id="bloodType"
            className={INPUT_CLASS}
            value={form.bloodType}
            onChange={(e) => set('bloodType')(e.target.value)}
            required
          >
            <option value="">Pilih</option>
            {BLOOD_TYPES.map((bt) => (
              <option key={bt} value={bt}>
                {bt}
              </option>
            ))}
          </select>
        </DonorFormField>

        <DonorFormField label="Rhesus" htmlFor="rhesus">
          <div className="flex gap-2 h-10.5">
            {(['positive', 'negative'] as const).map((val) => (
              <label key={val} className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="rhesus"
                  value={val}
                  checked={form.rhesus === val}
                  onChange={() => set('rhesus')(val)}
                  className="sr-only"
                />
                <div
                  className={`h-full flex items-center justify-center rounded-lg border text-xs font-bold transition-all ${
                    form.rhesus === val
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'border-gray-200 text-tertiary hover:border-primary/40'
                  }`}
                >
                  {val === 'positive' ? 'Positif (+)' : 'Negatif (-)'}
                </div>
              </label>
            ))}
          </div>
        </DonorFormField>

        <DonorFormField label="Jenis Kelamin" htmlFor="gender">
          <select
            id="gender"
            className={INPUT_CLASS}
            value={form.gender}
            onChange={(e) => set('gender')(e.target.value as 'L' | 'P')}
          >
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </DonorFormField>
      </div>

      {/* Tempat + Tanggal Lahir */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <DonorFormField label="Tempat Lahir" htmlFor="birthPlace">
          <input
            id="birthPlace"
            type="text"
            className={INPUT_CLASS}
            placeholder="Contoh: Tembilahan"
            value={form.birthPlace}
            onChange={(e) => set('birthPlace')(e.target.value)}
          />
        </DonorFormField>

        <DonorFormField label="Tanggal Lahir" htmlFor="birthDate">
          <input
            id="birthDate"
            type="date"
            className={INPUT_CLASS}
            value={form.birthDate}
            onChange={(e) => set('birthDate')(e.target.value)}
            required
          />
        </DonorFormField>
      </div>

      {/* Berat + Hemoglobin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <DonorFormField label="Berat Badan (kg)" htmlFor="weight">
          <input
            id="weight"
            type="number"
            min={45}
            className={INPUT_CLASS}
            placeholder="Min. 45 kg"
            value={form.weight}
            onChange={(e) => set('weight')(e.target.value)}
            required
          />
        </DonorFormField>

        <DonorFormField
          label="Kadar Hemoglobin (g/dL)"
          htmlFor="hemoglobin"
          optional
        >
          <input
            id="hemoglobin"
            type="number"
            step="0.1"
            className={INPUT_CLASS}
            placeholder="Contoh: 13.5"
            value={form.hemoglobin}
            onChange={(e) => set('hemoglobin')(e.target.value)}
          />
        </DonorFormField>
      </div>

      {/* Nomor WhatsApp */}
      <DonorFormField label="Nomor WhatsApp" htmlFor="phone">
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-secondary text-tertiary text-sm font-semibold">
            +62
          </span>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            className="flex-1 border border-gray-200 rounded-r-lg px-3 py-2.5 text-sm text-neutral placeholder:text-tertiary/60 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none bg-white"
            placeholder="81234567890"
            value={form.phone}
            onChange={(e) => set('phone')(e.target.value)}
            required
          />
        </div>
      </DonorFormField>

      {/* Alamat */}
      <DonorFormField label="Alamat Lengkap" htmlFor="address">
        <textarea
          id="address"
          rows={3}
          className={INPUT_CLASS}
          placeholder="Nama jalan, nomor rumah, RT/RW, Kelurahan, Kecamatan"
          value={form.address}
          onChange={(e) => set('address')(e.target.value)}
        />
      </DonorFormField>
    </form>
  );
}
