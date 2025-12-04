/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'flow': 'flow 1s linear infinite',
        'draw': 'draw 2s ease-out forwards',
        'grow-up': 'grow-up 0.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
      },
      keyframes: {
        flow: {
          '0%': { strokeDashoffset: '20' },
          '100%': { strokeDashoffset: '0' },
        },
        draw: {
          from: { strokeDashoffset: '1000' },
          to: { strokeDashoffset: '0' },
        },
        'grow-up': {
          from: { height: '0', opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

