
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
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
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
				// Authentic Horizon UI Color Palette
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
				// Horizon UI Brand Colors
				horizonGreen: {
					50: '#E1FFF4',
					100: '#BDFFE7',
					200: '#7BFECE',
					300: '#39FEB6',
					400: '#01F99E',
					500: '#01B574',
					600: '#01935D',
					700: '#016B44',
					800: '#00472D',
					900: '#002417',
				},
				horizonOrange: {
					50: '#FFF7EB',
					100: '#FFF1DB',
					200: '#FFE2B8',
					300: '#FFD28F',
					400: '#FFC46B',
					500: '#FFB547',
					600: '#FF9B05',
					700: '#C27400',
					800: '#855000',
					900: '#422800',
					950: '#1F1200',
				},
				horizonRed: {
					50: '#FCE8E8',
					100: '#FAD1D1',
					200: '#F4A4A4',
					300: '#EF7676',
					400: '#EA4848',
					500: '#E31A1A',
					600: '#B71515',
					700: '#891010',
					800: '#5B0B0B',
					900: '#2E0505',
					950: '#170303',
				},
				horizonBlue: {
					50: '#EBEFFF',
					100: '#D6DFFF',
					200: '#ADBFFF',
					300: '#8AA3FF',
					400: '#6183FF',
					500: '#3965FF',
					600: '#0036FA',
					700: '#0029BD',
					800: '#001B7A',
					900: '#000D3D',
					950: '#00071F',
				},
				horizonTeal: {
					50: '#EBFAF8',
					100: '#D7F4F2',
					200: '#AAE9E4',
					300: '#82DED6',
					400: '#59D4C9',
					500: '#33C3B7',
					600: '#299E94',
					700: '#1F756E',
					800: '#144D48',
					900: '#0B2826',
					950: '#051413',
				},
				horizonPurple: {
					50: '#EFEBFF',
					100: '#E9E3FF',
					200: '#422AFB',
					300: '#422AFB',
					400: '#7551FF',
					500: '#422AFB',
					600: '#3311DB',
					700: '#02044A',
					800: '#190793',
					900: '#11047A',
				},
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				display: ['Poppins', 'system-ui', 'sans-serif'],
				dm: ['DM Sans', 'sans-serif'],
			},
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'xl': '1rem',
				'2xl': '1.5rem',
				'3xl': '2rem',
			},
			boxShadow: {
				'soft': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 4px 16px -4px rgba(0, 0, 0, 0.05)',
				'medium': '0 4px 16px -4px rgba(0, 0, 0, 0.08), 0 8px 32px -8px rgba(0, 0, 0, 0.08)',
				'strong': '0 8px 32px -8px rgba(0, 0, 0, 0.12), 0 16px 64px -16px rgba(0, 0, 0, 0.12)',
				'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
				'3xl': '14px 17px 40px 4px',
				'inset': 'inset 0px 18px 22px',
				'darkinset': '0px 4px 4px inset',
			},
			backgroundImage: {
				'gradient-primary': 'linear-gradient(135deg, #422AFB 0%, #1B2559 100%)',
				'gradient-secondary': 'linear-gradient(135deg, #7551FF 0%, #422AFB 100%)',
				'gradient-accent': 'linear-gradient(135deg, #a855f7 0%, #422AFB 100%)',
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
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'112': '28rem',
				'128': '32rem',
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
