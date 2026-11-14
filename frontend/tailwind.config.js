/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "ui-sans-serif", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "ui-sans-serif", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#FFB020",
        },
        lime: "#86EFAC",
        ground: "#EFF0F2",
        plate: "#FFFFFF",
        muted: "#6E7178",
        line: "#E4E6EA",
        ink: {
          900: "#16181D",
          800: "#1A1D21",
        },
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp .6s cubic-bezier(.16,1,.3,1) both",
      },
    },
  },
  plugins: [],
};
