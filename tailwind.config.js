/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Near‑black neutrals
        text: '#0a0a0a',
        surface: '#171717',
        background: '#fafafa',
        // Restrained accent (indigo)
        accent: '#4f46e5',
        // Semantic states
        success: '#10b981',
        error: '#b91c1c',
        warning: '#f59e0b',
        border: '#1f2937',
      },
      typography: {
        // Custom type scale
        base: {
          html: {
            fontSize: '11px',
            lineHeight: '1.2',
            letterSpacing: '-0.01em',
          }
        },
        s: {
          html: {
            fontSize: '13px',
            lineHeight: '1.5',
          }
        },
        m: {
          html: {
            fontSize: '14px',
            lineHeight: '1.5',
          }
        },
        l: {
          html: {
            fontSize: '16px',
            lineHeight: '1.5',
          }
        },
        xl: {
          html: {
            fontSize: '20px',
            lineHeight: '1.2',
          }
        },
        '2xl': {
          html: {
            fontSize: '24px',
            lineHeight: '1.2',
          }
        },
        '3xl': {
          html: {
            fontSize: '32px',
            lineHeight: '1.2',
          }
        }
      },
      radius: {
        xs: '6px',
        sm: '8px',
        md: '6px',
        lg: '12px'
      },
      shadow: {
        card: '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)'
      }
    }
  },
  plugins: [],
};
