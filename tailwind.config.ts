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
          charcoal: '#141414',
          gray: '#1f1f1f',
          metal: '#2a2a2a',
          border: '#333333',
        },
        // High-contrast vibrant red for extreme readability on dark backgrounds
        blood: {
          DEFAULT: '#ff3333',
          dark: '#b30000',
          bright: '#ff6666',
        },
        rust: '#8c4b35',
        bone: '#e0d8c3',
        ash: '#a3a3a3',
        offwhite: '#f3f4f6',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
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
