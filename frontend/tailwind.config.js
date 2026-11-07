/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#0a1628', 900: '#0f2347', 800: '#16346b', 700: '#1a3a7a', 600: '#2a4d94' },
        gold: { 400: '#dcba6a', 500: '#c9a54a', 600: '#a98836' },
      },
      fontFamily: { sans: ['Poppins', 'system-ui', 'sans-serif'] },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        colUp: { '0%': { transform: 'translateY(0)' }, '100%': { transform: 'translateY(-50%)' } },
        colDown: { '0%': { transform: 'translateY(-50%)' }, '100%': { transform: 'translateY(0)' } },
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(18px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        pop: { '0%': { opacity: 0, transform: 'scale(.94)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        slideIn: { '0%': { opacity: 0, transform: 'translateX(24px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
      },
      animation: { 'col-up': 'colUp var(--dur, 40s) linear infinite', 'col-down': 'colDown var(--dur, 40s) linear infinite', marquee: 'marquee 30s linear infinite', slideIn: 'slideIn .25s ease-out', fadeUp: 'fadeUp .5s ease-out both', pop: 'pop .3s ease-out both' },
    },
  },
  plugins: [],
};
