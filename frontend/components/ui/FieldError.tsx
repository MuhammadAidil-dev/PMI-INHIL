// ============================================================
// FieldError: Tampilkan error satu field form secara inline
// ============================================================

interface FieldErrorProps {
  message?: string;
  className?: string;
}

/**
 * Komponen kecil untuk menampilkan error validasi di bawah field form.
 *
 * @example
 * <input {...register('email')} />
 * <FieldError message={appError?.validationErrors?.email} />
 */
export const FieldError = ({ message, className = '' }: FieldErrorProps) => {
  if (!message) return null;

  return (
    <p
      role="alert"
      className={`mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 ${className}`}
    >
      <span aria-hidden="true">⚠</span>
      {message}
    </p>
  );
};
