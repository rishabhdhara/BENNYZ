/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#171717",
          ivory: "#EDE6D9",
          "off-white": "#F7F5F0",
          mocha: "#92785F",
          sand: "#B8A58C",
          "secondary-text": "#77736C",
          border: "#E4DEC3",
          light: "#FAF8F5",
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.035em',
        luxury: '0.12em',
        editorial: '0.22em',
        ultra: '0.32em',
      },
      screens: {
        'xs': '480px',
      }
    },
  },
  plugins: [],
}
