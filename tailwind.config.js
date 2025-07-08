/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./index.js"
  ],
  theme: {
    extend: {
      colors: {
        'brand-background': '#0f172a',
        'brand-card': '#1e293b',
        'brand-accent': '#3b82f6',
        'brand-green': '#22c55e',
        'brand-red': '#ef4444',
        'brand-orange': '#f97316',
        'brand-text-primary': '#f8fafc',
        'brand-text-secondary': '#94a3b8',
      },
    },
  },
  plugins: [],
}
