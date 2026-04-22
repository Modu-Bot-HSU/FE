type CustomInputProps = {
  name: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  value?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  disabled?: boolean;
};

const CustomInput = ({
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  disabled = false,
}: CustomInputProps) => {
  return (
    <div
      className={`p-2 border border-gray-200 rounded-lg max-w-[320px] w-full ${className}`}
    >
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full outline-none text-lg placeholder-gray-300 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default CustomInput;
