/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "no-hover": { raw: "(hover: none)" },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        merriweather: ["Merriweather", "serif"],
      },
      backgroundImage: {
        mountains: "url('/mountains.jpg')",
      },
      boxShadow: {
        "dark-inner": "inset 0px 0px 5px 5px rgba(0,0,0,0.1);",
        base: "0 0 10px 0px rgb(0 0 0 / 0.25)",
        top: "0px -3px 10px 5px rgba(0,0,0,0.2)",
        spread: "0px 0px 50px -15px rgba(0,0,0,0.75)",
      },
      colors: {
        zuccini: {
          50: "#effef6",
          100: "#dafeea",
          200: "#b7fbd6",
          300: "#7ff6b7",
          400: "#40e88f",
          500: "#17d06f",
          600: "#0dac59",
          700: "#0e8748",
          800: "#116a3d",
          900: "#105734",
          950: "#034023",
        },
        deco: "#c5dfaa",
        clay: "#c5cfbf",
        tan: {
          50: "#f3f6ef",
          100: "#e7edde",
          200: "#cedabc",
          300: "#aec294",
          400: "#91ab70",
          500: "#738f53",
          600: "#58713f",
          700: "#455734",
          800: "#3a472d",
          900: "#323e29",
          950: "#192013",
        },
        gold: "#f8d15c",
        comp: "#ffe1cf",
        carnation: "#f36950",
        peppermint: "#eaf8e9",
      },
      animation: {
        marquee: "marquee 15s linear infinite",
        swivel: "swivel 0.5s ease-in-out",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        swivel: {
          "0%": { transform: "rotate(0deg)" },
          "30%": { transform: "rotate(1deg)" },
          "60%": { transform: "rotate(-0.5deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
    },
  },

  plugins: [],
};
