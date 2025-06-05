/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"

  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        TealGreen : "#2095A2"
      },
      spacing : {
        20 : "20px"
      }
    },
  },
  plugins: [],
}