import Image from 'next/image';
import React from 'react';
import { Shield } from 'lucide-react';

export const LoginBranding: React.FC = () => {
  return (
    <div className="hidden md:flex flex-col justify-center p-12 bg-[#f2f3ff] border-r border-gray-100">
      {/* Hero Image */}
      <div className="mb-8 relative w-full h-64">
        <Image
          src={`https://lh3.googleusercontent.com/aida-public/AB6AXuDT0lmEHTq3jLm9oqyoMMINJuopeccNXFsoLHzS4qx8UNvZkdZ6bbqALB2Tds4LAUKyxFMzOYwVB1Hsj1F1busvxWHdMGQbdPgbtbQsyDNm_h4IUzPDHyqswVcqk_Xqp4JBgTjdtM_Kozxu5bM2UKz-on9mtG-4ly7KJfx-uc-BtSXCwC_PrrTdIxhmqRYV3F2TelmM-952fTforBvA8Zrd72atipOBM6tMiIoUc41Rwd6Q97_SHnzbAR16AaN9hIjIMwTgBAeo1gNn`}
          alt="Medical professional environment"
          className="object-cover rounded-lg shadow-inner"
          fill
          sizes="33vh"
          loading="eager"
        />
      </div>

      {/* Tagline */}
      <h2 className="text-[32px] leading-10 tracking-[-0.01em] font-semibold text-[#131b2e] mb-4">
        Manajemen Sumber Daya PMI
      </h2>
      <p className="text-[16px] leading-6 text-[#5c5f61]">
        Akses aman untuk petugas Palang Merah Indonesia dalam mengelola
        inventaris, database donor, dan koordinasi unit mobil di seluruh
        wilayah.
      </p>

      {/* Security Badge */}
      <div className="mt-8 flex items-center gap-4">
        <div className="p-2 bg-[#e11d48] rounded-full text-white flex items-center justify-center shrink-0">
          <span>
            <Shield />
          </span>
        </div>
        <div>
          <p className="text-[14px] leading-5 tracking-[0.01em] font-semibold text-[#131b2e]">
            Enkripsi Tingkat Lanjut
          </p>
          <p className="text-[12px] leading-4 text-[#5c5f61]">
            Data Anda terlindungi sepenuhnya
          </p>
        </div>
      </div>
    </div>
  );
};
