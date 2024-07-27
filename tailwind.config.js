/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeOut: {
          "0%": { opacity: 1, transform: "translateY(0)" },
          "100%": { opacity: 0, transform: "translateY(-20px)" },
        },
        fadeOutToast: {
          "0%": { opacity: 1, transform: "translateY(0)" },
          "100%": { opacity: 0, transform: "translateY(-20px)" },
        },
        slideInFromLeft: {
          "0%": { transform: "translateX(-100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        slideOutToRight: {
          "0%": { transform: "translateX(0)", opacity: 1 },
          "100%": { transform: "translateX(100%)", opacity: 0 },
        },
        slideInFromRightBounce: {
          "0%": { transform: "translateX(100%)" },
          "80%": { transform: "translateX(-10px)" },
          "100%": { transform: "translateX(0)" },
        },
        moveUp: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-200px)" },
        },
        resize: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
        scaleUpDown: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
        },
        moveUpRandomX: {
          "0%": { transform: "translate(-50%, 0)", opacity: 1 },
          "100%": {
            transform: "translate(calc(-50% + var(--random-offset)), -200px)",
            opacity: 0,
          },
        },
      },
      animation: {
        "fade-in": "fadeIn 1s forwards",
        "fade-out": "fadeOut 1s forwards",
        "fade-out-toast": "fadeOutToast 3s forwards",
        "slide-in-from-left": "slideInFromLeft 1s forwards",
        "slide-out-to-right": "slideOutToRight 1s forwards 3s",
        "slide-in-from-right-bounce": "slideInFromRightBounce 1s ease",
        "move-up": "moveUp 1s forwards",
        resize: "resize 0.5s forwards",
        "move-up-random-x": "moveUpRandomX 1s forwards",
        "scale-up-down": "scaleUpDown 0.1s ease-in-out",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake", "forest"],
  },
};
