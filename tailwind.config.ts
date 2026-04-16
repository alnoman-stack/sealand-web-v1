import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9f0',
          100: '#dcf1dc',
          500: '#22c55e', // মূল Forest Green
          600: '#16a34a',
          700: '#15803d',
          900: '#14532d', // Deep Forest
        },
        accent: {
          DEFAULT: '#facc15', // Yellow accent
          dark: '#ca8a04',
        },
      },
    },
  },
  plugins: [],
};
export default config;