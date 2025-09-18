/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        arabic: ["Noto Kufi Arabic", "sans-serif"],
      },
      colors: {
        brand: "#8C52FF",
        brand_2: "#C5FF52",
      },
    },
  },
  plugins: [],
};
