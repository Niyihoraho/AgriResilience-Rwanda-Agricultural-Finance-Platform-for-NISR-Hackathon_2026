/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sidebar-bg': '#173D32',
        'sidebar-active': '#3D8C61',
        'sidebar-hover': '#1E4B3E',
        'agri-green': '#3D8C61',
        'agri-green-light': '#E8F3EB',
        'weather-blue': '#4D7EA8',
        'weather-blue-light': '#E9F1F7',
        'page-bg': '#F7F8F5',
        'card-border': '#E5E9E7',
        'text-primary': '#25312D',
        'text-secondary': '#6B7771',
        'text-muted': '#8C9993',
        'amber-accent': '#D99A32',
        'amber-light': '#FEF6E9',
        'red-accent': '#C84C4C',
        'red-light': '#FBEAEA',
        'purple-accent': '#7C3AED',
        'purple-light': '#F3E8FF',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 3px 8px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}

