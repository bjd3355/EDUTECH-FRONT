/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'pharma-green': {
          50: '#f0fdf4',  // Très clair (fond clair)
          400: '#4ade80', // Moyen (focus, liens)
          600: '#16a34a', // Principal (boutons, éléments principaux)
          700: '#15803d', // Hover
          900: '#14532d', // Texte foncé
        },
        // Redéfinition des couleurs système avec pharma-green
        border: '#16a34a',          // pharma-green-600
        input: '#f0fdf4',           // pharma-green-50
        ring: '#4ade80',            // pharma-green-400
        background: '#f0fdf4',      // pharma-green-50
        foreground: '#14532d',      // pharma-green-900
        primary: {
          DEFAULT: '#16a34a',       // pharma-green-600
          foreground: '#f0fdf4',    // pharma-green-50
        },
        secondary: {
          DEFAULT: '#4ade80',       // pharma-green-400
          foreground: '#14532d',    // pharma-green-900
        },
        destructive: {
          DEFAULT: '#15803d',       // pharma-green-700
          foreground: '#f0fdf4',    // pharma-green-50
        },
        muted: {
          DEFAULT: '#f0fdf4',       // pharma-green-50
          foreground: '#14532d',    // pharma-green-900
        },
        accent: {
          DEFAULT: '#4ade80',       // pharma-green-400
          foreground: '#14532d',    // pharma-green-900
        },
        popover: {
          DEFAULT: '#f0fdf4',       // pharma-green-50
          foreground: '#14532d',    // pharma-green-900
        },
        card: {
          DEFAULT: '#f0fdf4',       // pharma-green-50
          foreground: '#14532d',    // pharma-green-900
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};