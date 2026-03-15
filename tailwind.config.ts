import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          green: '#ff3b30',
          bg: '#0b0b0b',
          panel: '#121212',
          text: '#d8d8d8',
          muted: '#6b6b6b',
          accent: '#ff3b30',
          warn: '#f59e0b',
        },
        nothing: {
          900: '#0b0b0b',
          800: '#121212',
          700: '#1b1b1b',
          600: '#222222',
          500: '#2b2b2b',
          400: '#3b3b3b',
          300: '#6b6b6b',
          200: '#9a9a9a',
          100: '#d8d8d8',
        },
        accent: {
          DEFAULT: '#ff3b30',
          muted: '#ff6b61',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', '"Source Code Pro"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        blink: 'blink 1s step-start infinite',
        scanline: 'scanline 9s linear infinite',
      },
      boxShadow: {
        terminal: '0 0 0 1px rgba(0,255,156,0.35), inset 0 0 0 1px rgba(0,255,156,0.1)',
        none: 'none',
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '6px',
        lg: '8px',
      },
      backgroundImage: {
        'terminal-scanline':
          'repeating-linear-gradient(to bottom, rgba(0,255,156,0.03), rgba(0,255,156,0.03) 1px, transparent 1px, transparent 3px)',
      },
      transitionDuration: {
        fast: '140ms',
      },
    },
  },
  plugins: [typography],
} satisfies Config
