/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["sans-regular"],
        "sans-light": ["sans-light"],
        "sans-medium": ["sans-medium"],
        "sans-semibold": ["sans-semibold"],
        "sans-bold": ["sans-bold"],
        "sans-extrabold": ["sans-extrabold"],
      },
      colors: {
        brand: {
          50: "#F2F7F4",
          100: "#E1EFE7",
          200: "#B8D9C5",
          500: "#2D5A43",
          600: "#244936",
          700: "#1B3729",
          dark: "#1C382A",
        },
        surface: {
          background: "#FAFAF5",
          card: "#FFFFFF",
          border: "#F0F0EE",
        },
      },
    },
  },
  plugins: [],
};
