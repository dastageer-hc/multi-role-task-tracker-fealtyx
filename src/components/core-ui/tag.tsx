import { X } from "lucide-react";

interface TagProps {
  label: string;
  onRemove?: () => void;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  className?: string;
}

const variantMap = {
  default: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  success: "bg-green-100 text-green-800 hover:bg-green-200",
  warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  danger: "bg-red-100 text-red-800 hover:bg-red-200",
  info: "bg-blue-100 text-blue-800 hover:bg-blue-200",
};

const sizeMap = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export const Tag: React.FC<TagProps> = ({
  label,
  onRemove,
  variant = "default",
  size = "sm",
  className = "",
}) => {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variantMap[variant]}
        ${sizeMap[size]}
        ${className}
      `}
    >
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className='ml-1 p-0.5 hover:bg-opacity-20 rounded-full'
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
};
