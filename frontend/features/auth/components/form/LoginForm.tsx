'use client';

import { useState } from 'react';
import InputContainer from '@/components/input/Input';
import Button from '@/components/button/Button';
import { ShieldPlus } from 'lucide-react';

export const LoginForm = () => {
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <div className="w-full p-8 md:p-12 flex flex-col justify-center">
      {/* Logo & App Name */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg shrink-0">
          <span className="text-white">
            <ShieldPlus />
          </span>
        </div>
        <h1 className="text-[24px] leading-8 font-semibold text-primary tracking-tight">
          PMI Resource Manager
        </h1>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-[24px] leading-8 font-semibold text-[#131b2e]">
          Masuk ke Panel
        </h2>
        <p className="text-[14px] leading-5 text-[#5c5f61] mt-1">
          Silakan masukkan kredensial petugas Anda
        </p>
      </div>

      {/* Form */}
      <form className="w-full flex flex-col gap-4">
        {/* Identifier Field */}
        <InputContainer
          label="Email atau Username"
          type="text"
          name="Identifier"
          required={true}
          placeHolder="pmi12345"
          value={identifier}
          setValue={setIdentifier}
        />

        <InputContainer
          label="Password"
          type="password"
          name="password"
          required={true}
          placeHolder="*******"
          value={password}
          setValue={setPassword}
        />

        <div className="mt-4">
          <Button text="Masuk" type="submit" />
        </div>
      </form>
    </div>
  );
};
