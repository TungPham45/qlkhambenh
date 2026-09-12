/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        clinic: {
          ink: "#172033",
          muted: "#60708a",
          line: "#d9e2ec",
          blue: "#2563eb",
          teal: "#0f766e",
          green: "#16a34a",
          rose: "#e11d48"
        }
      }
    }
  },
  plugins: []
};
