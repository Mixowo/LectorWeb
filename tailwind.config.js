export default {
  darkMode: "class", // o 'media' si prefieres que sea automático por sistema
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
