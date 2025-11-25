import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		// Scan all source files for class names
		"./src/**/*.{ts,tsx,js,jsx}",
		"./index.html",
	],
	// Safelist dynamic classes that might not be detected by PurgeCSS
	safelist: [
		// Add patterns for dynamically generated classes
		{
			pattern: /^(bg|text|border)-(primary|secondary|cta|surface)/,
		},
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
				surface: {
					DEFAULT: 'hsl(var(--surface))',
					secondary: 'hsl(var(--surface-secondary))'
				},
				text: {
					primary: 'hsl(var(--text-primary))',
					secondary: 'hsl(var(--text-secondary))',
					muted: 'hsl(var(--text-muted))',
					inverse: 'hsl(var(--text-inverse))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					hover: 'hsl(var(--primary-hover))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					hover: 'hsl(var(--secondary-hover))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				cta: {
					DEFAULT: 'hsl(var(--cta-primary))',
					hover: 'hsl(var(--cta-primary-hover))',
					foreground: 'hsl(var(--cta-foreground))'
				},
				nav: {
					background: 'hsl(var(--nav-background))',
					border: 'hsl(var(--nav-border))',
					hover: 'hsl(var(--nav-hover))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				success: 'hsl(var(--success))',
				warning: 'hsl(var(--warning))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
					border: 'hsl(var(--card-border))'
				},
				brand: {
					primary: 'hsl(var(--brand-primary))',
					secondary: 'hsl(var(--brand-secondary))',
					accent: 'hsl(var(--brand-accent))'
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				serif: ['Crimson Text', 'Georgia', 'serif']
			},
			boxShadow: {
				subtle: 'var(--shadow-subtle)',
				medium: 'var(--shadow-medium)',
				large: 'var(--shadow-large)'
			},
			transitionTimingFunction: {
				base: 'cubic-bezier(0.4, 0, 0.2, 1)',
				smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
