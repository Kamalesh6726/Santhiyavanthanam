/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          // Light Mode
          background: '#F8F5EE',
          primary: '#191815',
          saffron: '#C98232',
          gold: '#D8AD62',
          sand: '#E9DFCF',
          green: '#6F8C70',
          white: '#FFFFFF',
          
          // Dark Mode
          darkBg: '#10100F',
          darkCard: '#181816',
          darkElevated: '#211F1B',
          darkPrimaryText: '#F5F1E8',
          darkMutedText: '#A7A196',
        },
      },
      borderRadius: {
        'sm': '12px',
        'md': '18px',
        'lg': '24px',
        'hero': '32px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
