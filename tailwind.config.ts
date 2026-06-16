import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ink: { DEFAULT: "#0A0A0B", soft: "#2B2B2E", muted: "#6B6B70" },
        paper: { DEFAULT: "#FAFAF8", card: "#FFFFFF", sunken: "#F2F1EC" },
        "emerald-brand": { DEFAULT: "#0B5D4E", hover: "#094A3E", tint: "#E7F1EE", ring: "#0B5D4E" },
        line: "#E8E6DF"
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"]
      },
      borderRadius: {
        xl2: "1rem",
        "2xl2": "1.25rem"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(10,10,11,0.04), 0 8px 24px rgba(10,10,11,0.06)",
        "soft-lg": "0 2px 4px rgba(10,10,11,0.04), 0 16px 48px rgba(10,10,11,0.08)"
      },
      letterSpacing: {
        tight2: "-0.02em"
      }
    },
  },
  plugins: [],
};
export default config;
