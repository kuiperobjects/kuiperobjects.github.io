/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        green: '#2E8B57',
        silver: '#C0C0C0',
        lavender: '#B794F6',
      },
    },
  },
  plugins: [],
};
