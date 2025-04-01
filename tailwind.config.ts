
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
				// Custom theme colors
				cream: "#FFF8E7",
				ember: "#E25822",
				flame: "#F5853F",
				warmBrown: "#8B4513",
				darkAmber: "#FF8C00",
				// Highlight colors for feelings - plus marquées
				shame: "#FF3333", // Rouge vif
				guilt: "#00D1B2", // Turquoise vif
				// Period colors (age ranges) - plus marquées
				period1: "#FFD700", // 0-10 ans - Or vif
				period2: "#00CC66", // 10-20 ans - Vert émeraude
				period3: "#0088FF", // 20-30 ans - Bleu ciel vif
				period4: "#003366", // 30-40 ans - Bleu marine foncé
				period5: "#9900CC", // 40-50 ans - Violet royal
				period6: "#FF0066", // 50+ ans - Rose vif
				// Domain colors - plus marquées
				domain1: "#FF0000", // spiritualité - Rouge pur
				domain2: "#FF6600", // mental/psychologie - Orange vif
				domain3: "#FFCC00", // professionnel - Jaune doré
				domain4: "#FFFF00", // financier - Jaune pur
				domain5: "#66CC00", // social - Vert pomme
				domain6: "#00CCCC", // familial et couple - Cyan
				domain7: "#0066FF", // santé et physique - Bleu royal
			},
			backgroundImage: {
				'fireplace-gradient': 'linear-gradient(to bottom, #FFF8E7, #FFEBC8)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				serif: ['Playfair Display', 'Georgia', 'serif'],
				sans: ['Montserrat', 'sans-serif'],
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
				'flickr': {
					'0%, 100%': { opacity: '0.8' },
					'50%': { opacity: '1' },
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'flickr': 'flickr 3s ease-in-out infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
