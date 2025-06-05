/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0088cc',
        'primary-light': '#54a9eb',
        'primary-dark': '#006bb3',
        'bg-primary': '#ffffff',
        'bg-secondary': '#f4f4f5',
        'text-primary': '#000000',
        'text-secondary': '#707579',
        border: '#e4e4e7',
        'message-out': '#effdde', 
        'message-in': '#ffffff',
      },
      width: {
        '80': '20rem',
        'sidebar': '320px',
      },
      height: {
        'screen-header': 'calc(100vh - 60px)',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
