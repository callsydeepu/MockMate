module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        primary: '#7F5AF0',
        secondary: '#6C5CE7',
        accent: '#00BFA6',
        glass: 'rgba(255,255,255,0.1)',
        slate: {
          950: '#0f172a',
          900: '#111827',
          800: '#1f2937',
          700: '#374151',
          600: '#4b5563',
          500: '#6b7280',
          400: '#9ca3af',
          300: '#d1d5db',
          200: '#e5e7eb',
          100: '#f3f4f6',
          50: '#f9fafb',
        },
        violet: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        cyan: {
          50: '#ecf9ff',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        fuchsia: {
          500: '#d946ef',
          600: '#c026d3',
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '20px',
        xl: '40px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.4)',
        'glass-lg': '0 20px 60px rgba(0, 0, 0, 0.5)',
        'glow-sm': '0 0 10px rgba(139, 92, 246, 0.3)',
        'glow-md': '0 0 20px rgba(139, 92, 246, 0.4)',
        'glow-lg': '0 0 30px rgba(139, 92, 246, 0.5)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)',
        'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.4)',
        'glow-pink': '0 0 20px rgba(217, 70, 239, 0.4)',
      },
      textShadow: {
        glow: '0 0 10px rgba(139, 92, 246, 0.5)',
        'glow-lg': '0 0 20px rgba(139, 92, 246, 0.6)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-in': 'slide-in 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'bounce-sm': 'bounce 1s infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            opacity: '1',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
          },
          '50%': { 
            opacity: '0.8',
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.8)',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': `
          linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          linear-gradient(45deg, rgba(34, 211, 238, 0.05) 0%, transparent 50%)
        `,
      },
    },
  },
  plugins: [],
};
