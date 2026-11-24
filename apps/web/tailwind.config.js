/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fideliz: {
          green: "#10B981",
          emerald: "#059669",
          dark: "#0F172A",
          card: "#1E293B",
          gold: "#F59E0B"
        }
      }
    },
  },
  plugins: [],
}
