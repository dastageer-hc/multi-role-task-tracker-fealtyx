import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { TaskStatus } from "@/types/task";
import { getTaskStatusConfig } from "@/utils/taskUtils";

interface StatusSelectProps {
  value: TaskStatus;
  onChange: (value: TaskStatus) => void;
  options: { value: TaskStatus; label: string }[];
  className?: string;
}

export const StatusSelect: React.FC<StatusSelectProps> = ({
  value,
  onChange,
  options,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const statusConfig = getTaskStatusConfig(value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  const getTriggerClasses = () => {
    const baseClasses =
      "flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    let variantClasses = "";

    if (statusConfig?.variant === "default") {
      variantClasses = "bg-blue-100 text-blue-700 border border-blue-200";
    } else if (statusConfig?.variant === "success") {
      variantClasses = "bg-green-100 text-green-700 border border-green-200";
    } else if (statusConfig?.variant === "warning") {
      variantClasses = "bg-yellow-100 text-yellow-700 border border-yellow-200";
    } else if (statusConfig?.variant === "danger") {
      variantClasses = "bg-red-100 text-red-700 border border-red-200";
    } else if (statusConfig?.variant === "info") {
      variantClasses = "bg-purple-100 text-purple-700 border border-purple-200";
    }

    return `${baseClasses} ${variantClasses} ${className}`.trim();
  };

  const getOptionClasses = (option: { value: TaskStatus; label: string }) => {
    const baseClasses =
      "w-full text-left relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100";
    const optionConfig = getTaskStatusConfig(option.value);
    let variantClasses = "";

    if (optionConfig?.variant === "default") {
      variantClasses = "text-blue-700";
    } else if (optionConfig?.variant === "success") {
      variantClasses = "text-green-700";
    } else if (optionConfig?.variant === "warning") {
      variantClasses = "text-yellow-700";
    } else if (optionConfig?.variant === "danger") {
      variantClasses = "text-red-700";
    } else if (optionConfig?.variant === "info") {
      variantClasses = "text-purple-700";
    }

    const selectedClass = option.value === value ? "bg-gray-50" : "";

    return `${baseClasses} ${variantClasses} ${selectedClass}`.trim();
  };

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className={getTriggerClasses()}
      >
        {selectedOption?.label}
        <ChevronDown
          className={`h-4 w-4 opacity-50 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className='absolute z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md  bg-white shadow-md animate-in fade-in-80'>
          <div className='p-1'>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={getOptionClasses(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
