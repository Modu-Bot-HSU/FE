type CustomInputProps = {
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
};

const CustomInput = ({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
}: CustomInputProps) => {
  return (
    <div
      className={`p-2 border border-gray-200 rounded-lg max-w-xs ${className}`}
    >
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full outline-none text-lg placeholder-gray-300 bg-transparent"
      />
    </div>
  );
};

export default CustomInput;
