/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    screens: {
      'md': {'max': '1095px'},
      'sm': {'max': '639px'},
      'xs': {'max': '542px'},
    },
    extend: {},
  },
  plugins: [],
}
