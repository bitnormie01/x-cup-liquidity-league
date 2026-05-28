import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pitch: '#0f3d2e',
        okx: '#0b0b0f',
        line: '#d9e2dc',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 1px 2px rgb(15 23 42 / 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
