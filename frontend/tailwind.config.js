/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Libre Baskerville', 'Times New Roman', 'serif'],
        serif: ['Libre Baskerville', 'Times New Roman', 'serif'],
        raleway: ['Raleway', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#A90046',
          burgundy: '#8B0A3D',
          rose: '#A90046',
          light: '#D93D73',
          lighter: '#E85A8A',
          lightest: '#F5D0D8',
          dark: '#8B0A3D',
          darker: '#7A0F3C',
        },
        accent: {
          gold: '#C9A870',
          'gold-light': '#E8D7B7',
        },
        charcoal: '#2D2D2D',
        'warm-cream': '#F9F6F1',
        'warm-beige': '#EDE8E0',
        'text-dark': '#1A1A1A',
        'text-muted': '#8A8A8A',
      },
    },
  },
  plugins: [],
}

