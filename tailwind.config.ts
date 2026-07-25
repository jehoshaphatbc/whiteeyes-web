import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#080808',
          charcoal: '#121212',
          gray: '#1c1c1c',
          metal: '#262626',
          border: '#2e2e2e',
        },
        // Rich, elegant crimson burgundy for sophisticated metal aesthetics
        blood: {
          DEFAULT: '#a80d0d',
          dark: '#730000',
          bright: '#cc1414',
        },
        rust: '#8c4b35',
        bone: '#e0d8c3',
        ash: '#9ca3af',
        silver: '#d1d5db',
        offwhite: '#f9fafb',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Cinzel', 'Georgia', 'serif'],
        serif: ['Cinzel', 'Georgia', 'serif'],
      },
      animation: {
        'grain': 'grain 8s steps(10) infinite',
        'flicker': 'flicker 3s infinite',
        'glitch': 'glitch 0.4s ease-in-out infinite',
      },
      keyframes: {
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '30%': { transform: 'translate(3%, 15%)' },
          '50%': { transform: 'translate(-10%, 5%)' },
          '70%': { transform: 'translate(15%, -5%)' },
          '90%': { transform: 'translate(-5%, 10%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
          '52%': { opacity: '0.4' },
          '54%': { opacity: '0.9' },
          '80%': { opacity: '0.95' },
          '82%': { opacity: '0.3' },
          '84%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
