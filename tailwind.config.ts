import type { Config } from "tailwindcss";

export default {
	darkMode: ['class'],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Shadcn UI variables
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'var(--color-primary)',
					light: 'var(--color-primary-light)',
					dark: 'var(--color-primary-dark)',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'var(--color-secondary)',
					light: 'var(--color-secondary-light)',
					dark: 'var(--color-secondary-dark)',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				accent: {
					DEFAULT: 'var(--color-accent)',
					light: 'var(--color-accent-light)',
					dark: 'var(--color-accent-dark)',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				
				// Design Token Colors
				brand: {
					primary: 'var(--color-primary)',
					secondary: 'var(--color-secondary)',
					accent: 'var(--color-accent)',
				},
				neutral: {
					50: 'var(--color-neutral-50)',
					100: 'var(--color-neutral-100)',
					200: 'var(--color-neutral-200)',
					300: 'var(--color-neutral-300)',
					400: 'var(--color-neutral-400)',
					500: 'var(--color-neutral-500)',
					600: 'var(--color-neutral-600)',
					700: 'var(--color-neutral-700)',
					800: 'var(--color-neutral-800)',
					900: 'var(--color-neutral-900)',
				},
				surface: {
					primary: 'var(--color-surface-primary)',
					secondary: 'var(--color-surface-secondary)',
					tertiary: 'var(--color-surface-tertiary)',
				},
				text: {
					primary: 'var(--color-text-primary)',
					secondary: 'var(--color-text-secondary)',
					tertiary: 'var(--color-text-tertiary)',
					inverse: 'var(--color-text-inverse)',
				},
				semantic: {
					success: 'var(--color-success)',
					'success-light': 'var(--color-success-light)',
					'success-dark': 'var(--color-success-dark)',
					warning: 'var(--color-warning)',
					'warning-light': 'var(--color-warning-light)',
					'warning-dark': 'var(--color-warning-dark)',
					error: 'var(--color-error)',
					'error-light': 'var(--color-error-light)',
					'error-dark': 'var(--color-error-dark)',
					info: 'var(--color-info)',
					'info-light': 'var(--color-info-light)',
					'info-dark': 'var(--color-info-dark)',
				},
				
				// Keep existing Horizon UI colors for backward compatibility
				white: '#ffffff',
				lightPrimary: '#F4F7FE',
				blueSecondary: '#4318FF',
				brandLinear: '#868CFF',
				gray: {
					50: '#F5F6FA',
					100: '#EEF0F6',
					200: '#DADEEC',
					300: '#C9D0E3',
					400: '#B0BBD5',
					500: '#B5BED9',
					600: '#A3AED0',
					700: '#707eae',
					800: '#2D396B',
					900: '#1B2559',
				},
				navy: {
					50: '#d0dcfb',
					100: '#aac0fe',
					200: '#a3b9f8',
					300: '#728fea',
					400: '#3652ba',
					500: '#1b3bbb',
					600: '#24388a',
					700: '#1B254B',
					800: '#111c44',
					900: '#0b1437',
				},
				red: {
					50: '#ee5d501a',
					100: '#fee2e2',
					200: '#fecaca',
					300: '#fca5a5',
					400: '#f87171',
					500: '#f53939',
					600: '#ea0606',
					700: '#b91c1c',
					800: '#991b1b',
					900: '#7f1d1d',
				},
				green: {
					50: '#05cd991a',
					100: '#dcfce7',
					200: '#bbf7d0',
					300: '#86efac',
					400: '#4ade80',
					500: '#22c55e',
					600: '#17ad37',
					700: '#15803d',
					800: '#166534',
					900: '#14532d',
				},
				blue: {
					50: '#eff6ff',
					100: '#dbeafe',
					200: '#bfdbfe',
					300: '#93c5fd',
					400: '#60a5fa',
					500: '#3b82f6',
					600: '#2152ff',
					700: '#1d4ed8',
					800: '#344e86',
					900: '#00007d',
				},
				purple: {
					50: '#faf5ff',
					100: '#f3e8ff',
					200: '#e9d5ff',
					300: '#d8b4fe',
					400: '#c084fc',
					500: '#a855f7',
					600: '#9333ea',
					700: '#7928ca',
					800: '#6b21a8',
					900: '#581c87',
				},
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				display: ['Poppins', 'system-ui', 'sans-serif'],
				dm: ['DM Sans', 'sans-serif'],
			},
			fontSize: {
				xs: ['var(--text-xs)', { lineHeight: 'var(--leading-tight)' }],
				sm: ['var(--text-sm)', { lineHeight: 'var(--leading-normal)' }],
				base: ['var(--text-base)', { lineHeight: 'var(--leading-normal)' }],
				lg: ['var(--text-lg)', { lineHeight: 'var(--leading-relaxed)' }],
				xl: ['var(--text-xl)', { lineHeight: 'var(--leading-relaxed)' }],
				'2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-tight)' }],
				'3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-tight)' }],
				'4xl': ['var(--text-4xl)', { lineHeight: 'var(--leading-tight)' }],
			},
			fontWeight: {
				normal: 'var(--font-normal)',
				medium: 'var(--font-medium)',
				semibold: 'var(--font-semibold)',
				bold: 'var(--font-bold)',
			},
			spacing: {
				xs: 'var(--spacing-xs)',
				sm: 'var(--spacing-sm)',
				md: 'var(--spacing-md)',
				lg: 'var(--spacing-lg)',
				xl: 'var(--spacing-xl)',
				'2xl': 'var(--spacing-2xl)',
				'3xl': 'var(--spacing-3xl)',
			},
			borderRadius: {
				sm: 'var(--radius-sm)',
				md: 'var(--radius-md)',
				lg: 'var(--radius-lg)',
				xl: 'var(--radius-xl)',
				'2xl': 'var(--radius-2xl)',
				full: 'var(--radius-full)',
			},
			boxShadow: {
				sm: 'var(--shadow-sm)',
				md: 'var(--shadow-md)',
				lg: 'var(--shadow-lg)',
				xl: 'var(--shadow-xl)',
				glass: 'var(--shadow-glass)',
				'3xl': '14px 17px 40px 4px',
				inset: 'inset 0px 18px 22px',
				darkinset: '0px 4px 4px inset',
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-accent': 'var(--gradient-accent)',
				'gradient-surface': 'var(--gradient-surface)',
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'slide-up': 'slide-up 0.4s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
			},
			backdropBlur: {
				'xs': '2px',
			},
			screens: {
				sm: '576px',
				'sm-max': { max: '576px' },
				md: '768px',
				'md-max': { max: '768px' },
				lg: '992px',
				'lg-max': { max: '992px' },
				xl: '1200px',
				'xl-max': { max: '1200px' },
				'2xl': '1320px',
				'2xl-max': { max: '1320px' },
				'3xl': '1600px',
				'3xl-max': { max: '1600px' },
				'4xl': '1850px',
				'4xl-max': { max: '1850px' },
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
