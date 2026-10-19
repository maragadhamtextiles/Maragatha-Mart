/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './scripts/**/*.ts'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Cinzel's carved capitals echo the emblem's lettering; Cormorant
        // carries the italic tagline. `montserrat` is the old name for the UI
        // face, kept because hundreds of elements use the class.
        heading: ['Cinzel', 'Georgia', 'serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Lato', 'system-ui', 'sans-serif'],
        montserrat: ['Lato', 'system-ui', 'sans-serif'],
        dancing: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        greatvibes: ["Great Vibes", "cursive"],
      },
      colors: {
        primary: {
          red: 'rgb(var(--primary-red) / <alpha-value>)',
          yellow: 'rgb(var(--primary-yellow) / <alpha-value>)',
          orange: 'rgb(var(--primary-orange) / <alpha-value>)',
        },
        secondary: {
          blue: 'rgb(var(--secondary-blue) / <alpha-value>)',
          purple: 'rgb(var(--secondary-purple) / <alpha-value>)',
          dark: '#1E1E1E',
        },
        brand: {
          emerald: '#003620',
          jade: '#0E6B47',
          gold: '#C9A227',
          'gold-light': '#F4DE8E',
          maroon: '#7A1F3D',
          ivory: '#FDFBF5',
        },
        background: 'rgb(var(--background) / <alpha-value>)',
        text: 'rgb(var(--text) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        'card-border': 'rgb(var(--card-border) / <alpha-value>)',
      },
      animation: {
        'sparkle': 'sparkle 1.5s linear infinite',
        'fadeIn': "fadeIn 2s ease-in-out",
        'fadeInOut': "fadeInOut 3s ease-in-out infinite",
        'marquee': "marquee 40s linear infinite",
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeInOut: {
          "0%, 100%": { opacity: 0, transform: "translateY(10px)" },
          "10%, 90%": { opacity: 1, transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
      }
    },
  },
  plugins: [],
};