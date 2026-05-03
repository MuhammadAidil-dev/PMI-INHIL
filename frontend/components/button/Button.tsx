type ButtonPropsType = {
  text: string;
  type: 'submit' | 'button';
  disabled?: boolean;
};

const Button = ({
  text,
  type = 'button',
  disabled = false,
}: ButtonPropsType) => {
  return (
    <button
      type={type}
      className={`w-full py-2 px-4 bg-primary text-white font-medium text-base rounded-md hover:bg-hover duration-200 ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
