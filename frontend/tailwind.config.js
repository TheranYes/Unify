module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        charcoal: "#4a4a4a",
        cream: "#ffbd4",
      },
      keyframes: {
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "50%": { transform: "translateX(50%)" }, // Add intermediate step
          "100%": { transform: "translateX(0)" },
        },
        slideOutLeft: {
          "0%": { transform: "translateX(0)", opacity: 1 },
          "100%": { transform: "translateX(-50%)", opacity: 0 }, // Only move halfway
        },
      },
      animation: {
        "slide-in-right": "slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-out-left": "slideOutLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
