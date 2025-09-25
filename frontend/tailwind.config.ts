import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './.storybook/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: { 
    extend: {} 
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;