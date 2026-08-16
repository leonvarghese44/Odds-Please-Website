/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#050505',
          800: '#09090b',
          700: '#111827',
          600: '#1a1a1a',
          500: '#222222',
        },
        emerald: {
          50: '#f3ffe0',
          100: '#e3ffad',
          200: '#cdff70',
          300: '#a5fa36',
          400: '#71FB05',
          500: '#71FB05',
          600: '#5ac904',
          700: '#469903',
          800: '#347002',
          900: '#224a02',
          950: '#112501',
        },
        neon: {
          DEFAULT: '#71FB05',
          hover: '#88fc2b',
          glow: 'rgba(113, 251, 5, 0.42)',
          subtle: 'rgba(113, 251, 5, 0.32)',
        },
        surface: {
          DEFAULT: '#09090b',
          elevated: '#18181b',
          border: '#27272a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Eurostile', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(113, 251, 5, 0.42)' },
          '50%': { boxShadow: '0 0 0 6px rgba(113, 251, 5, 0)' },
        },
        'neon-pulse': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(113, 251, 5, 0.32)' },
          '50%': { boxShadow: '0 0 20px rgba(113, 251, 5, 0.55), 0 0 5px #71FB05' },
        },
        'marquee-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-ltr': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
        'fade-in': 'fade-in 0.3s ease-out both',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'marquee-scroll': 'marquee-scroll 75s linear infinite',
        'marquee-ltr': 'marquee-ltr 75s linear infinite',
      },
    },
  },
  plugins: [],
};