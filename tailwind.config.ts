import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
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
				// Tourism-specific colors
				ocean: {
					50: 'hsl(var(--ocean-50))',
					100: 'hsl(var(--ocean-100))',
					500: 'hsl(var(--ocean-500))',
					600: 'hsl(var(--ocean-600))',
					900: 'hsl(var(--ocean-900))'
				},
				sunset: {
					50: 'hsl(var(--sunset-50))',
					100: 'hsl(var(--sunset-100))',
					500: 'hsl(var(--sunset-500))',
					600: 'hsl(var(--sunset-600))',
					700: 'hsl(var(--sunset-700))',
					900: 'hsl(var(--sunset-900))'
				},
				nature: {
					50: 'hsl(var(--nature-50))',
					100: 'hsl(var(--nature-100))',
					500: 'hsl(var(--nature-500))',
					600: 'hsl(var(--nature-600))',
					900: 'hsl(var(--nature-900))'
				}
			},
			backgroundImage: {
				'gradient-hero': 'linear-gradient(135deg, hsl(var(--ocean-500)), hsl(var(--sunset-500)))',
				'gradient-card': 'linear-gradient(145deg, hsl(var(--ocean-50)), hsl(var(--sunset-50)))',
				'gradient-overlay': 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))'
			},
			fontFamily: {
				'script': ['Dancing Script', 'cursive'],
				'display': ['Playfair Display', 'serif']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-hover': {
					'0%': { transform: 'scale(1)' },
					'100%': { transform: 'scale(1.05)' }
				}
			},
			animation: {
				'float': 'float 6s ease-in-out infinite',
				'fade-up': 'fade-up 0.8s ease-out',
				'scale-hover': 'scale-hover 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
