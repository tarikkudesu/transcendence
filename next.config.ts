
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	distDir: '.next',
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				port: '',
				pathname: '/drpmyxx4c/image/upload/**/avatars/**',
				search: '',
			},
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				port: '',
				pathname: '/drpmyxx4c/image/upload/**/fastify_avatar/**',
				search: '',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				port: '',
				pathname: '/**',
				search: '',
			},
		],
	},
};
export default nextConfig;
