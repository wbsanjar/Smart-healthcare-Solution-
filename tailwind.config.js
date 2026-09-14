/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef7ee',
          100: '#fdedd3',
          200: '#f9d7a5',
          300: '#f5ba6d',
          400: '#f09433',
          500: '#e87722',
          600: '#da5c17',
          700: '#b54416',
          800: '#90361a',
          900: '#742e18',
        },
        night: {
          50: '#f6f6f7',
          100: '#e2e3e5',
          200: '#c5c6cb',
          300: '#a0a2ab',
          400: '#7c7e8a',
          500: '#61636f',
          600: '#4c4d58',
          700: '#3e3f48',
          800: '#1e1f26',
          900: '#121318',
          950: '#0a0b0e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
