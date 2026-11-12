/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F6F6F7",
        peach: "#FFF1F2",
        beige: "#F3F4F6",
        sand: "#E5E7EB",
        tan: "#B10500",
        ink: "#111111",
        primary: "#E10600",
      },
      backgroundColor: {
        primary: "#E10600",
      },
    },
  },
  plugins: [],
};
