/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        night: '#0B1021',
        cyber: '#5D5FEF',
        lava: '#FF5F6D',
        sage: '#9EF8E4'
      },
      boxShadow: {
        glow: '0 10px 40px rgba(93,95,239,0.35)'
      }
    }
  },
  plugins: []
};
