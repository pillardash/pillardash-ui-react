const animate = require("tailwindcss-animate");
const typography = require("@tailwindcss/typography");

const withOpacity = (variable, fallback) => `rgb(var(${variable}, ${fallback}) / <alpha-value>)`;

module.exports = {
  content: ["./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: withOpacity("--pd-primary-50", "240 253 250"),
          100: withOpacity("--pd-primary-100", "204 251 241"),
          400: withOpacity("--pd-primary-400", "45 212 191"),
          500: withOpacity("--pd-primary-500", "20 184 166"),
          600: withOpacity("--pd-primary-600", "13 148 136"),
          700: withOpacity("--pd-primary-700", "15 118 110"),
          800: withOpacity("--pd-primary-800", "17 94 89"),
          900: withOpacity("--pd-primary-900", "19 78 74"),
          DEFAULT: withOpacity("--pd-primary", "14 138 116"),
        },
        secondary: withOpacity("--pd-secondary", "14 138 170"),
        dark: withOpacity("--pd-dark", "31 41 55"),
      },
    },
  },
  plugins: [animate, typography],
};
