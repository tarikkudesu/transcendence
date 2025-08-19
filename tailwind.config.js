/** @type {import('tailwindcss').Config} */
const config = {
	content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			screens: {
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1536px',
			},
			colors: {
				dark: {
					50: '#e6e8ec',
					100: '#c0c5cf',
					200: '#9aa2b2',
					300: '#747f95',
					400: '#4e5c78',
					500: '#36425f',
					600: '#283349',
					700: '#1f2938',
					800: '#181f2b',
					900: '#161d2a', // base
					950: '#131926',
				},
				accent: {
					50: '#f7fce6',
					100: '#e9f7b8',
					200: '#d4eb63',
					300: '#b3ec4b', // base
					400: '#8ec936',
					500: '#6cb42a',
					600: '#548c1f',
					700: '#3a6515',
					800: '#24430d',
					900: '#142707',
				},
				magenta: {
					50: '#fdf2fa',
					100: '#fce7f6',
					200: '#fbcfe8',
					300: '#f9a8d4',
					400: '#f472b6',
					500: '#d832a8', // base
					600: '#b82992',
					700: '#931f75',
					800: '#70175a',
					900: '#4e103f',
				},
				golden: {
					50: '#FFF7E0',
					100: '#FFEDB3',
					200: '#FFE180',
					300: '#FFD54D',
					400: '#FFCA1A',
					500: '#FFC000', // base
					600: '#E0A900',
					700: '#B88700',
					800: '#755800',
					900: '#473600',
					900: '#1A1300',
				},
			},
			animation: {
				spin: 'spin 1s linear infinite',
				'spin-reverse': 'spin-reverse 1s linear infinite',
			},
			keyframes: {
				spin: {
					from: { transform: 'rotate(0deg)' },
					to: { transform: 'rotate(360deg)' },
				},
				'spin-reverse': {
					from: { transform: 'rotate(360deg)' },
					to: { transform: 'rotate(0deg)' },
				},
			},
		},
	},
	plugins: [],
};

export default config;
