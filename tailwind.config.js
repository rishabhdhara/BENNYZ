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
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        editorial: '0.16em',
        luxury: '0.11em',
        ultra: '0.26em',
      },
      screens: {
        'xs': '480px',
      }
    },
  },
  plugins: [],
};
