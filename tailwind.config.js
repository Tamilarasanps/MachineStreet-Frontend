/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")], // ✅ MUST be present for NativeWind Metro plugin
  theme: {
    extend: {
      colors: {
        TealGreen: "#2095A2",
      },
      height: {
        'screen-80': '80vh',
        'header': '64px',
        'modal': '90%',
        'half': '50%',
      },
      spacing: {
        20: "20px",
      },
    },
  },
  plugins: [],
};
