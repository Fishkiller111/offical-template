import type { Config } from 'tailwindcss'

export default <Config>{
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary, #8B5CF6)',
          dark: 'var(--color-primary-dark, #7C3AED)'
        },
        dark: {
          DEFAULT: 'var(--bg-dark, #0F172A)',
          light: 'var(--bg-dark-light, #1E293B)',
          lighter: 'var(--bg-dark-lighter, #334155)'
        },
        light: {
          DEFAULT: 'var(--text-light, #F8FAFC)',
          dark: 'var(--text-light-dark, #94A3B8)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(to bottom, rgba(11, 17, 32, 0.9), rgba(11, 17, 32, 1)), url("/images/hero-bg.jpg")'
      },
      borderRadius: {
        'lg': '1rem',
        'xl': '1.5rem'
      }
    }
  },
  plugins: []
}