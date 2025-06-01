interface BadgeProps {
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  children: React.ReactNode;
  className?: string;
}

const badgeVariantMap = {
  default: "bg-gray-100 text-gray-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
};

const badgeSizeMap = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  size = "sm",
  children,
  className = "",
}) => {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${badgeVariantMap[variant]}
        ${badgeSizeMap[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
