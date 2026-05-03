type DonorFormFieldProps = {
  label: string;
  htmlFor: string;
  optional?: boolean;
  children: React.ReactNode;
  error?: string;
};

export function DonorFormField({
  label,
  htmlFor,
  optional = false,
  children,
  error,
}: DonorFormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-xs font-bold uppercase tracking-wider text-tertiary"
      >
        {label}
        {optional && (
          <span className="ml-1 text-xs font-normal normal-case tracking-normal opacity-60">
            (Opsional)
          </span>
        )}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
