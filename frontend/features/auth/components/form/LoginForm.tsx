'use client';

import { FormEvent, useState, useTransition } from 'react';
import InputContainer from '@/components/input/Input';
import Button from '@/components/button/Button';
import { ShieldPlus } from 'lucide-react';
import { loginAction } from '../../action/auth.action';
import { ToastError } from '@/lib/toast/ToastNotification';
import { ActionResult, LoginResponse } from '../../type/auth.type';

// Tipe error yang mungkin dikembalikan loginAction
type FormError = Extract<ActionResult<LoginResponse>, { success: false }>;

export const LoginForm = () => {
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<FormError | null>(null);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await loginAction({ identifier, password });

      if (!result.success && !result.validationErrors) {
        console.log(result);
        ToastError(result.message);
      }

      if (!result.success && result.validationErrors) {
        setFormError(result);
      }
    });
  };

  // helper field error
  const fieldError = (field: string) => formError?.validationErrors?.[field];

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
        <h2 className="text-[24px] leading-8 font-semibold text-neutral">
          Masuk ke Panel
        </h2>
        <p className="text-[14px] leading-5 text-tertiary mt-1">
          Silakan masukkan kredensial petugas Anda
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
        <InputContainer
          label="Email atau Username"
          type="text"
          name="identifier"
          required={true}
          placeHolder="pmi12345"
          value={identifier}
          setValue={setIdentifier}
          isError={{
            error: !!fieldError('identifier'),
            message: fieldError('identifier') ?? '',
          }}
        />

        <InputContainer
          label="Password"
          type="password"
          name="password"
          required={true}
          placeHolder="*******"
          value={password}
          setValue={setPassword}
          isError={{
            error: !!fieldError('password'),
            message: fieldError('password') ?? '',
          }}
        />

        <div className="mt-4">
          <Button
            text={isPending ? 'Memproses...' : 'Masuk'}
            type="submit"
            disabled={isPending}
          />
        </div>
      </form>
    </div>
  );
};
