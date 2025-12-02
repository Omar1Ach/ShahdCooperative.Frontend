import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Golden Honey shades
        "golden-honey": "#F5A623",
        "deep-amber": "#B45309",
        primary: "#F5A623",

        // Natural/Organic colors
        "natural-beeswax": "#FFF8E1",
        "forest-green": "#2E7D32",
        "dark-forest-green": "#1A362D",
        "deep-moss-green": "#556B2F",

        // Background colors
        "background-light": "#FDFBF5",
        "background-dark": "#221e10",

        // Text colors
        "text-light": "#3A3A3A",
        "text-dark": "#FDFBF5",
        "text-muted-light": "#9c8749",
        "text-muted-dark": "#a39b83",

        // Border colors
        "border-light": "#EAE8E1",
        "border-dark": "#3a3525",

        // Card backgrounds
        "card-light": "#FFFFFF",
        "card-dark": "#2a2618",
        "dark-card": "#2F4842",
        "dark-accent": "#264139",

        // Status colors
        success: "#28a745",
        info: "#007bff",
        warning: "#ffc107",
        danger: "#dc3545",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        heading: ["Playfair Display", "serif"],
        serif: ["Playfair Display", "serif"],
      },
      borderRadius: {
        DEFAULT: "0.75rem", // 12px
        lg: "1rem",          // 16px
        xl: "1.5rem",        // 24px
        full: "9999px",
      },
      backgroundImage: {
        'hex-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='86.6' viewBox='0 0 100 86.6'%3E%3Cpolygon points='50,0 100,25 100,75 50,100 0,75 0,25' fill='rgba(224,224,224,0.1)'/%3E%3C/svg%3E\")",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.4s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
