type Option = {
  value: string;
  option: string;
};

type SelectContainerProps = {
  value: string;
  setValue: (params: string) => void;
  options: Option[] | [];
  label: string;
  name: string;
  placeholder?: string;
  isError?: {
    error: boolean;
    message: string;
  };
};

export default function SelectContainer({
  value,
  setValue,
  options,
  label,
  name,
  placeholder = 'Select option',
  isError = {
    error: false,
    message: '',
  },
}: SelectContainerProps) {
  return (
    <div className="flex flex-col w-full gap-2">
      <label htmlFor={name} className="text-foreground text-base font-semibold">
        {label}
      </label>

      <select
        name={name}
        id={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`
          focus:outline-none
          py-2 px-4
          text-sm font-medium
          text-foreground
          border 
          rounded-sm
          focus:border-2
          transition-all
          w-full
          ${isError.error ? ' border-red-300' : 'border-foreground'}
        `}
      >
        {/* default option */}
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((data) => (
          <option key={data.value} value={data.value}>
            {data.option}
          </option>
        ))}
      </select>

      {isError.error && (
        <p className="text-xs text-red-300">
          {isError.message || 'Validation error'}
        </p>
      )}
    </div>
  );
}
