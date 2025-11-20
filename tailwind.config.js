/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./insecure/**/*.{js,ts,jsx,tsx,mdx}",
    "./secure/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca"
        },
        accent: {
          500: "#f97316",
          600: "#ea580c"
        }
      },
      boxShadow: {
        glow: "0 0 15px rgba(99,102,241,0.3)"
      }
    }
  },
  plugins: []
};
