import React from "react";
import { ChevronDown } from "lucide-react";
import { Typography } from "./typography";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: "small" | "medium";
  className?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  variant = "medium",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const baseStyles =
    "relative w-full bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const variantStyles = {
    small: "py-1.5 px-3 text-sm",
    medium: "py-2 px-4 text-base",
  };

  return (
    <div
      ref={selectRef}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      <button
        type='button'
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className='w-full flex items-center justify-between'
        disabled={disabled}
      >
        <Typography
          variant={variant === "small" ? "body-sm" : "body"}
          tone={selectedOption ? "default" : "muted"}
          className='truncate'
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Typography>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className='absolute z-10 w-full mt-1 bg-white border border-gray-200 overflow-scroll rounded-lg shadow-lg max-h-60 overflow-auto'>
          {options.map((option, i) => (
            <button
              key={option.value + i}
              type='button'
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                option.value === value ? "bg-blue-50" : ""
              }`}
            >
              <Typography
                variant={variant === "small" ? "body-sm" : "body"}
                tone={option.value === value ? "accent" : "default"}
              >
                {option.label}
              </Typography>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
