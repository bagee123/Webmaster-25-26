/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        orange: {
          primary: '#ea580c',
          dark: '#d94308',
        },
        pink: {
          primary: '#ec4899',
          dark: '#be185d',
        },
        // Status colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        // Neutral
        text: {
          primary: '#0f172a',
          secondary: '#64748b',
          tertiary: '#94a3b8',
        },
        bg: {
          primary: '#ffffff',
          secondary: '#f8fafc',
        },
      },
      backgroundImage: {
        'gradient-orange-pink': 'linear-gradient(135deg, #ea580c 0%, #ec4899 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideIn: {
          'from': { opacity: '0', transform: 'translateY(16px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          'from': { opacity: '0', transform: 'translateY(-20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
