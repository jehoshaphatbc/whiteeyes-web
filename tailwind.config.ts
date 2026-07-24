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
          DEFAULT: '#0a0a0a',
          charcoal: '#111111',
          gray: '#1a1a1a',
          metal: '#262626',
          border: '#333333',
        },
        blood: {
          DEFAULT: '#8b0000',
          dark: '#5a0000',
          bright: '#b22222',
        },
        rust: '#6b3d2a',
        bone: '#c8c0a8',
        ash: '#999990',
        offwhite: '#e8e8e0',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
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
