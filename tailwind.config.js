/** @type {import('tailwindcss').Config} */
const colors = require('./src/themes/colors');

module.exports = {
  content: ['./src/app/**/*.{js,jsx,ts,tsx}', './src/components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: colors.light,
        dark: colors.dark,
      },
    },
  },
  plugins: [],
};
