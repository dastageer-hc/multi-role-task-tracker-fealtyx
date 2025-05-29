import { JSX } from "react";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements & keyof HTMLElementTagNameMap;
  variant?: TypographyVariant;
  tone?: TypographyTone;
  children: React.ReactNode;
  className?: string;
}

type TypographyVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "body-lg"
  | "body"
  | "body-sm"
  | "label"
  | "code"
  | "chip"
  | "tooltip";

type TypographyTone =
  | "default"
  | "muted"
  | "accent"
  | "danger"
  | "success"
  | "white";

const variantMap: Record<TypographyVariant, string> = {
  display: "text-4xl font-bold",
  h1: "text-3xl font-bold",
  h2: "text-2xl font-semibold",
  h3: "text-xl font-semibold",
  "body-lg": "text-lg",
  body: "text-base",
  "body-sm": "text-sm",
  label: "text-xs font-medium uppercase tracking-wide",
  code: "text-sm font-medium font-mono bg-muted px-1 py-0.5 rounded",
  chip: "text-xs font-medium px-2 py-0.5 rounded-full",
  tooltip: "text-xs",
};

const toneMap: Record<TypographyTone, string> = {
  default: "text-gray-800",
  muted: "text-gray-500",
  accent: "text-blue-600",
  danger: "text-red-600",
  success: "text-green-600",
  white: "text-white",
};

export const Typography = ({
  as: Tag = "span",
  variant = "body",
  tone = "default",
  className = "",
  children,
  ...props
}: TypographyProps) => {
  return (
    <Tag
      className={`${variantMap[variant]} ${toneMap[tone]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
};
