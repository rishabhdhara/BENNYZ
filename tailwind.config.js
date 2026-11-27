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
          black: "#122320",
          forest: "#173B35",
          oxblood: "#702B3A",
          copper: "#A85F3D",
          gold: "#C19A55",
          midnight: "#263B5A",
          tobacco: "#C69B78",
          ivory: "#EFE9DD",
          "off-white": "#F7F3EB",
          mocha: "#A85F3D",
          sand: "#C69B78",
          "secondary-text": "#5E5A52",
          border: "#DDD4C3",
          light: "#FAF7F2",
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
