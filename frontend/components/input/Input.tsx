type InputPropsType = {
  label: string;
  type?: string;
  name: string;
  required?: boolean;
  placeHolder: string;
  value: string;
  setValue: (params: string) => void;
  isError?: {
    error: boolean;
    message: string;
  };
};

const InputContainer = ({
  label = 'Label',
  type = 'text',
  name = 'Input',
  placeHolder = 'Placeholder',
  value,
  setValue,
  isError = {
    error: false,
    message: '',
  },
  required = false,
}: InputPropsType) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-semibold text-base">
        {label}
      </label>
      <input
        id={name}
        type={type}
        className={`bg-background  rounded-md transition duration-300 px-2 py-2 text-sm text-foreground flex items-center border-2 border-foreground focus:outline-none ${isError.error ? ' border-red-300' : ''}`}
        placeholder={placeHolder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        required={required}
      />
      {isError.error && (
        <p className="text-xs text-red-300">
          {isError.message || 'Validation error'}
        </p>
      )}
    </div>
  );
};

export default InputContainer;
