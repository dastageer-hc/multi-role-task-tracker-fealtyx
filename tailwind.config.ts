import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "pale-purple": "#e5d9f2",
        magnolia: "#f5efff",
        periwinkle: "#cdc1ff",
        "tropical-indigo": "#a594f9",
        "medium-slate-blue": "#7371fc",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
      borderWidth: {
        DEFAULT: "1px",
        thick: "2px",
      },
      boxShadow: {
        light: "0 1px 3px rgba(0,0,0,0.12)",
        medium: "0 4px 6px rgba(0,0,0,0.15)",
        heavy: "0 10px 20px rgba(0,0,0,0.2)",
      },
      backgroundImage: {
        "gradient-top-right":
          "linear-gradient(45deg, #e5d9f2, #f5efff, #cdc1ff, #a594f9, #7371fc)",
        "gradient-radial":
          "radial-gradient(circle, #e5d9f2, #f5efff, #cdc1ff, #a594f9, #7371fc)",
      },
    },
  },
};

export default config;
