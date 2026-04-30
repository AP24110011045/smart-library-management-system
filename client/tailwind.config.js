/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif']
      },
      colors: {
        ink: '#172033',
        moss: '#0f766e',
        clay: '#b45309',
        cream: '#f5f7fb',
        paper: '#ffffff'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(23, 32, 51, 0.12)'
      }
    }
  },
  plugins: []
};
