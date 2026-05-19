import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./services/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#2D4739",
        muted: "#6f8076",
        brand: {
          50: "#f1f8e9",
          100: "#e8f5e9",
          500: "#81c784",
          600: "#66bb6a",
          700: "#4f9a54"
        },
        skysoft: "#e3f2fd",
        coral: "#ff8a80",
        amber: "#f59e0b"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
