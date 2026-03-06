import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          green: '#00ff9c',
          bg: '#050807',
          panel: '#09100d',
          text: '#00ff9c',
          muted: '#8b949e',
          accent: '#00e5ff',
          warn: '#ffc857',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', '"Source Code Pro"', 'monospace'],
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
