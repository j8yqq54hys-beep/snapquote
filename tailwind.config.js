/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        text: '#1e293b',
        bg: '#ffffff',
        surface: '#ffffff',
        primary: '#0f172a',
        secondary: '#64748b',
        accent: '#6b81a3',
        success: '#10b981',
        error: '#b91c1c',
        border: '#e5e7eb',
      },
    },
  },
  plugins: [],
};
