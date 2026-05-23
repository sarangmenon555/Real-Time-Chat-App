/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["DM Mono", "monospace"],
        sans: ["DM Sans", "sans-serif"],
      },
      colors: {
        surface: "#0a0a0a",
        panel: "#0e0e0e",
        border: "#1a1a1a",
        accent: "#e8c547",
        green: "#47e8a0",
        blue: "#47c5e8",
        pink: "#e847a0",
      },
    },
  },
  plugins: [],
};
