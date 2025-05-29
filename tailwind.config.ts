import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        'primary-dark': '#7C3AED',
        dark: {
          DEFAULT: '#0B1120',
          light: '#1E293B',
          lighter: '#334155'
        },
        light: {
          DEFAULT: '#F8FAFC',
          dark: '#E2E8F0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(to bottom, rgba(11, 17, 32, 0.9), rgba(11, 17, 32, 1)), url("/images/hero-bg.jpg")'
      }
    }
  },
  plugins: []
} satisfies Config