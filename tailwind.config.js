/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#6366F1',
          DEFAULT: '#4F46E5',
          dark: '#3730A3',
        },
        secondary: {
          light: '#F3F4F6',
          DEFAULT: '#E5E7EB',
          dark: '#9CA3AF',
        },
        dev: '#10B981',
        marketing: '#F59E0B',
        manager: '#EF4444',
        client: '#8B5CF6',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
