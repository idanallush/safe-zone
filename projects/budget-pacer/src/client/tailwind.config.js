/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1B4F72',
        success: '#27AE60',
        warning: '#F39C12',
        danger: '#E74C3C',
      },
    },
  },
  plugins: [],
};
