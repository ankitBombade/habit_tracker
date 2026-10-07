/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#09090B',
        surface: {
          50: '#18181B',
          100: '#27272A',
          200: '#3F3F46',
          300: '#52525B',
          400: '#71717A',
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        purple: {
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        orange: {
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glow: '0 0 20px rgba(16, 185, 129, 0.25)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.25)',
        'glow-orange': '0 0 20px rgba(249, 115, 22, 0.3)',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        flame: 'flame 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        flame: {
          '0%': { transform: 'scale(1) rotate(-2deg)', filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.6))' },
          '100%': { transform: 'scale(1.08) rotate(2deg)', filter: 'drop-shadow(0 0 16px rgba(234, 88, 12, 0.9))' },
        },
      },
    },
  },
  plugins: [],
};
