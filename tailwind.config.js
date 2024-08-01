/** @type {import('tailwindcss').Config} */
export default {
   content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary-main': '#0230310c',
        'secondary-main': '#fafafb',
        'yellow': '#faaf11',
        'reddish': '#DC3545',
        'text-primary': '#011627d5',
        'text-paragraph': '#1e1e1ea2',
        'secondary-yellow': '#FFC448',
      },
      fontFamily: {
        'Grotesk': "Space Grotesk",
        'header': 'Bungee',
        'style': 'Sacramento',
        'rubik': 'Rubik',
        'poppins': 'Poppins'
      }
    },
  },
  plugins: [],
}

