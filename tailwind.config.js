/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        "pumpkin": {
          DEFAULT: "#FD802E",
          hover: "#E56D1F",
          light: "#FFF7ED",
          border: "#FED7AA"
        },
        "charcoal": {
          DEFAULT: "#1E293B",
          dark: "#0F172A"
        },
        "tlater": {
          DEFAULT: "#0284C7",
          light: "#E0F2FE",
          border: "#BAE6FD"
        },
        "vibe-points": "#F59E0B",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        logo: ["Poppins", "Outfit", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "card": "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)",
        "card-hover": "0 12px 24px -6px rgba(0, 0, 0, 0.08), 0 4px 8px -4px rgba(0, 0, 0, 0.04)",
      }
    },
  },
  plugins: [],
}
