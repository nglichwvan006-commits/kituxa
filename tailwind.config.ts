import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./services/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18212f",
        muted: "#64748b",
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e"
        },
        coral: "#fb7185",
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
