/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080D18",
        surface: {
          DEFAULT: "#0D1525",
          card: "#111C30",
          hover: "#17253f",
          border: "#23334C",
        },
        primary: {
          DEFAULT: "#38BDF8",
          dark: "#0284C7",
          light: "#7DD3FC",
        },
        secondary: {
          DEFAULT: "#6366F1",
          dark: "#4F46E5",
          light: "#818CF8",
        },
        cyber: {
          blue: "#38BDF8",
          indigo: "#6366F1",
          emerald: "#22C55E",
          amber: "#F59E0B",
          rose: "#EF4444",
          slate: "#94A3B8",
          light: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(56, 189, 248, 0.25)',
        'glow-danger': '0 0 25px -5px rgba(239, 68, 68, 0.25)',
        'glow-warning': '0 0 25px -5px rgba(245, 158, 11, 0.25)',
        'glow-success': '0 0 25px -5px rgba(34, 197, 94, 0.25)',
      },
    },
  },
  plugins: [],
};
