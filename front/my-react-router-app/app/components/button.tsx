interface ButtonProps {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    type: "button" | "submit" | "reset";
    className?: string;
}

export default function Button ({ label, onClick, disabled = false, type = "button", className = '' }: ButtonProps) {
    return (
        <div className="flex flex-row">
            <button
                onClick={onClick}
                disabled={disabled}
                type={type}
                className={`px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-500 transition duration-300 ease-in-out ${className}`}
            >
                {label}
            </button>
        </div>
    );
};
