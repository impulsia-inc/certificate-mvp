import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#FAF9F4',
        },
        surface: {
          white: '#FFFFFF',
          alt: '#F5F4EF',
          sec: '#EFEEE9',
          mobile: '#F4F3EE',
          panel: '#263C59',
          overlay: '#0F1E36',
          footer: '#0E1520',
        },
        gold: {
          DEFAULT: '#AF9052',
          champagne: '#FFDEA5',
          intense: '#775A19',
          admin: '#7D6540',
          'champagne-sec': '#E0C296',
          glow: '#F5D794',
        },
        brandBlue: {
          action: '#263C59',
          tech: '#2563EB',
        },
        content: {
          titleDesktop: '#000412',
          titleMobile: '#0E2642',
          darkSec: '#1B1C19',
          body: '#44474D',
          muted: '#75777E',
          placeholder: '#6B7280',
          dim: '#C5C6CE',
          onDarkSec: '#7886A3',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-jakarta)', 'sans-serif'],
        mobile: ['var(--font-inter)', 'sans-serif'],
        mono: ['Liberation Mono', 'monospace'],
      },
      borderRadius: {
        'none': '0px',
        'xs': '2px',
        'checkbox': '2.5px',
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'elevation-sm': '0 1px 2px -1px rgb(0 0 0 / 0.1), 0 1px 3px 0 rgb(0 0 0 / 0.1)',
        'elevation-md': '0 2px 4px -2px rgb(0 0 0 / 0.1), 0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'elevation-lg': '0 4px 6px -4px rgb(0 0 0 / 0.1), 0 10px 15px -3px rgb(0 0 0 / 0.1)',
        'elevation-xl': '0 8px 10px -6px rgb(0 0 0 / 0.1), 0 20px 25px -5px rgb(0 0 0 / 0.1)',
        'media-card': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner-subtle': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'btn-login': '0 4px 14px 0 rgb(38 60 89 / 0.35)',
        'admin-header': '0 1px 8px 0 rgb(15 30 54 / 0.04)',
        'admin-sidebar': '1px 0 12px 0 rgb(15 30 54 / 0.03)',
        'mobile-header': '0 1px 8px 0 rgb(0 0 0 / 0.04)',
        'mobile-nav': '0 -2px 12px 0 rgb(38 60 89 / 0.06)',
        'glow-gold': '0 0 6px 0 rgb(245 215 148 / 0.60)',
      },
      backdropBlur: {
        'xs': '1px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '24px',
      },
      letterSpacing: {
        'hero-desktop': '-1.12px',
        'title-desktop': '-0.90px',
        'hero-mobile': '-0.70px',
        'btn-desktop': '1.5px',
        'btn-mobile': '0.85px',
      },
    },
  },
  plugins: [],
};

export default config;
