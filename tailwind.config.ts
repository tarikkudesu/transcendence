/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
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
					900: '#161d2a',
				},
				accent: {
					50: '#f7fce6',
					100: '#e9f7b8',
					200: '#d4eb63',
					300: '#b3ec4b',
					400: '#8ec936',
					500: '#6cb42a',
					600: '#548c1f',
					700: '#3a6515',
					800: '#24430d',
					900: '#142707',
				},
			},
		},
	},
	plugins: [],
};

export default config;
