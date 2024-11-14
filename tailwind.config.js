/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-lavender': '#EAE4FF',
        'dark-navy': '#2E4053',
        'powder-pink': '#FFC1C1',
      },
    },
  },
  plugins: [],
}