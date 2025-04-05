
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
				// Robot theme colors
				robot: {
					blue: '#0EA5E9',
					red: '#F43F5E',
					yellow: '#FCD34D',
					green: '#10B981',
					purple: '#8B5CF6',
					dark: '#1A1F2C',
					metal: '#8E9196',
					light: '#E5DEFF',
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
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
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
				'pulse-glow': {
					'0%, 100%': { 
						opacity: '1',
						filter: 'brightness(1)'
					},
					'50%': { 
						opacity: '0.8',
						filter: 'brightness(1.2)'
					},
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'robot-speak': {
					'0%, 100%': { transform: 'scaleY(0.8)' },
					'50%': { transform: 'scaleY(1.2)' },
				},
				'robot-speak-mechanical': {
					'0%, 100%': { transform: 'translateY(0)' },
					'25%': { transform: 'translateY(-2px)' },
					'75%': { transform: 'translateY(2px)' },
				},
				'robot-speak-pulse': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.3)' },
				},
				'robot-speak-wave': {
					'0%': { transform: 'translateX(-3px)' },
					'25%': { transform: 'translateX(3px)' },
					'50%': { transform: 'translateX(-3px)' },
					'75%': { transform: 'translateX(3px)' },
					'100%': { transform: 'translateX(-3px)' },
				},
				'robot-speak-glitch': {
					'0%, 100%': { transform: 'skew(0deg, 0deg)' },
					'20%': { transform: 'skew(10deg, 0deg)' },
					'40%': { transform: 'skew(-10deg, 0deg)' },
					'60%': { transform: 'skew(10deg, 0deg)' },
					'80%': { transform: 'skew(-10deg, 0deg)' },
				},
				'scanning-eye': {
					'0%, 100%': { transform: 'translateX(-50%)' },
					'50%': { transform: 'translateX(600%)' },
				},
				'radar-scan': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
				'radar-scan-reverse': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(-360deg)' },
				},
				'radar-scan-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
				'radar-scan-reverse-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(-360deg)' },
				},
				'sound-wave': {
					'0%, 100%': { transform: 'scaleY(0.5)' },
					'50%': { transform: 'scaleY(1.5)' },
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s infinite ease-in-out',
				'float': 'float 6s infinite ease-in-out',
				'robot-speak': 'robot-speak 0.5s infinite ease-in-out',
				'robot-speak-mechanical': 'robot-speak-mechanical 0.3s infinite ease-in-out',
				'robot-speak-pulse': 'robot-speak-pulse 0.5s infinite ease-in-out',
				'robot-speak-wave': 'robot-speak-wave 0.5s infinite ease-in-out',
				'robot-speak-glitch': 'robot-speak-glitch 0.6s infinite',
				'scanning-eye': 'scanning-eye 2s infinite ease-in-out',
				'radar-scan': 'radar-scan 3s infinite linear',
				'radar-scan-reverse': 'radar-scan-reverse 3s infinite linear',
				'radar-scan-slow': 'radar-scan-slow 20s infinite linear',
				'radar-scan-reverse-slow': 'radar-scan-reverse-slow 15s infinite linear',
				'sound-wave': 'sound-wave 0.4s infinite ease-in-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
