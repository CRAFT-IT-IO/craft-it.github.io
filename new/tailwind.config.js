module.exports = {
  content: [
    "./src/**/*.{html,js}", // Cela inclut tous les fichiers HTML et JS dans src
    "./public/**/*.{html,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        aspekta: ["Aspekta", "sans-serif"],
      },
    },
  },
  plugins: [],
};
