import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Primary violet (Pocus-style accent)
        violet: {
          50:  '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        },
        // Green secondary
        green: {
          50:  '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        // Dark navy (hero backgrounds)
        navy: {
          950: '#080B14',
          900: '#0D1117',
          800: '#161B22',
          700: '#21262D',
          600: '#30363D',
          500: '#484F58',
          400: '#6E7681',
          300: '#8B949E',
          200: '#B1BAC4',
          100: '#C9D1D9',
          50:  '#F0F6FC',
        },
        // Slate for text
        slate: {
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'card':      '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-md':   '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.06)',
        'card-lg':   '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)',
        'card-xl':   '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)',
        'glow':      '0 0 0 1px rgba(139,92,246,0.3), 0 4px 16px rgba(139,92,246,0.2)',
        'glow-green':'0 0 0 1px rgba(34,197,94,0.3), 0 4px 16px rgba(34,197,94,0.15)',
        'inner':     'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
        'btn':       '0 1px 2px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.05)',
        'btn-violet':'0 1px 2px rgba(124,58,237,0.3), 0 4px 8px rgba(124,58,237,0.2)',
      },
      backgroundImage: {
        'gradient-hero':   'linear-gradient(135deg, #080B14 0%, #0D1117 50%, #1a0d2e 100%)',
        'gradient-violet': 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
        'gradient-green':  'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        'gradient-card':   'linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(124,58,237,0.02) 100%)',
        'gradient-border': 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(34,197,94,0.2))',
        'noise':           "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      borderRadius: {
        'xl2': '1rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':      'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        glowPulse: { '0%,100%': { boxShadow: '0 0 20px rgba(139,92,246,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(139,92,246,0.5)' } },
      },
    },
  },
  plugins: [],
};
export default config;
