interface InputProps {
    label: string;
    name: string;
    type?: string;
    value?: string;
    placeholder?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    required?: boolean;
}

export default function Input (
    {label,
    name,
    type = "text",
    value,
    placeholder,
    onChange,
    className = "",
    required = false}: InputProps
  ) {
    return (
      <div className="flex flex-row">
        <label htmlFor={name} className="min-w-24">
          {label}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          className={`px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out ${className}`}
        />
      </div>
    );
  };