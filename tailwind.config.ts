import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: 'rgba(151, 206, 76, 1)',
          '300': 'rgba(151, 206, 76, 0.3)',
        },
        background: {
          default: '#e4a788',
        },
        secondary: {
          main: 'rgba(171, 213, 236, 1)',
          '300': 'rgba(171, 213, 236, 0.3)',
        },
      }
    },
  },
  plugins: [],
}
export default config
