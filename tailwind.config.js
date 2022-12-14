module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}','./components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
     extend: {
       colors: {
         "dim-gray": "#616161",
         "alt-gray": '#3e3e3e',
         "gold": "#e2b731"
       }
     },
  },
  variants: {
    extend: {},
  },
  plugins: []
}