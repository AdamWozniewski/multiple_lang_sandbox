/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/views/**/*.ejs", // Widoki EJS
    "./frontend/js/**/*.js", // Pliki JavaScript, w których mogą być klasy Tailwind
    "./frontend/**/*.html"   // Ewentualne inne pliki HTML
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

