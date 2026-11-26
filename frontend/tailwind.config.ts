import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core PRISM Design Tokens
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          subtle: '#EFF6FF',
          border: '#DBEAFE',
          dark: '#1E40AF',
        },
        background: '#F8FAFC',
        canvas: '#F8FAFC',
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F1F5F9',
          subtle: '#F8FAFC',
          muted: '#F1F5F9',
          elevated: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E2E8F0',
          subtle: '#F1F5F9',
          strong: '#CBD5E1',
        },
        'primary-text': '#0F172A',
        'secondary-text': '#475569',
        'muted-text': '#94A3B8',
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
        },
        success: {
          DEFAULT: '#16A34A',
          hover: '#15803D',
          subtle: '#F0FDF4',
          border: '#BBF7D0',
          text: '#15803D',
        },
        warning: {
          DEFAULT: '#D97706',
          hover: '#B45309',
          subtle: '#FFFBEB',
          border: '#FDE68A',
          text: '#B45309',
        },
        danger: {
          DEFAULT: '#DC2626',
          hover: '#B91C1C',
          subtle: '#FEF2F2',
          border: '#FECACA',
          text: '#B91C1C',
        },
        info: {
          DEFAULT: '#0284C7',
          hover: '#0369A1',
          subtle: '#F0F9FF',
          border: '#BAE6FD',
          text: '#0369A1',
        },
        // Backward compatibility mappings
        brand: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          subtle: '#EFF6FF',
          border: '#DBEAFE',
          dark: '#1E40AF',
        },
        sonar: {
          pass: '#16A34A',
          passBg: '#F0FDF4',
          passBorder: '#BBF7D0',
          warn: '#D97706',
          warnBg: '#FFFBEB',
          warnBorder: '#FDE68A',
          fail: '#DC2626',
          failBg: '#FEF2F2',
          failBorder: '#FECACA',
          gate: '#059669',
        },
        quizlet: {
          DEFAULT: '#4F46E5',
          subtle: '#EEF2FF',
          border: '#C7D2FE',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'Consolas',
          '"Cascadia Code"',
          '"Segoe UI Mono"',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          '"JetBrains Mono"',
          'monospace',
        ],
      },
      borderRadius: {
        sm: '0.25rem',   // 4px
        DEFAULT: '0.375rem', // 6px
        md: '0.375rem',  // 6px
        lg: '0.5rem',    // 8px (standard card)
        xl: '0.75rem',   // 12px
        '2xl': '1rem',   // 16px
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.03), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'dropdown': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      },
      letterSpacing: {
        tighter: '-0.035em',
        tight: '-0.02em',
      },
    },
  },
  plugins: [],
}

export default config
