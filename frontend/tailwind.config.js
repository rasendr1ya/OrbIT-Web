/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Minimal color palette - primarily black/white/gray
        primary: {
          DEFAULT: '#000000',
          light: '#1a1a1a',
          lighter: '#333333',
        },
        accent: {
          DEFAULT: '#2563eb', // Clean blue for accents
          light: '#3b82f6',
          dark: '#1d4ed8',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.06)',
        'hover': '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'card': '12px',
      },
    },
  },
  plugins: [],
}
