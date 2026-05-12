import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F4E8D2',
          50: '#FBF6E8',
          100: '#F4E8D2',
          200: '#EADFC0',
        },
        terracotta: {
          DEFAULT: '#BC623D',
          dark: '#A35130',
        },
        forest: {
          DEFAULT: '#2D3F2C',
          dark: '#1F2D1E',
          light: '#4A6347',
        },
        mustard: '#C99B3D',
      },
      fontFamily: {
        // Section headings — Fraunces, vintage expressive serif.
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        // Body copy — Libre Baskerville, warm editorial serif.
        body: ['var(--font-body)', 'Georgia', 'serif'],
        // Small caps labels, buttons, footer micro — Alegreya SC.
        label: ['var(--font-label)', 'Georgia', 'serif'],
        // Invitation-style serif — DM Serif Display, for the signup heading.
        invitation: ['var(--font-invitation)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
