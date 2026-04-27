/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gym: {
          bg: '#0f1115',
          surface: '#171a21',
          border: '#2a2f3a',
          accent: '#f97316',
          muted: '#94a3b8',
        },
      },
    },
  },
  plugins: [],
}
