/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        Palatino: ['Palatino Linotype', 'sans-serif'],
      },
      boxShadow: {
        custom: '4px 3px 0px 0px rgb(103, 58, 183)',
      },
      colors: {
        customPurple: '#6f42c1',
        hcolor: '#6610f2',
        search: 'rgba(0, 0, 0, 0.2);',
      },
    },
  },
  plugins: [],
}