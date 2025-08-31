import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	distDir: 'build',
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				port: '',
				pathname: '/drpmyxx4c/image/upload/v1751976105/avatars/**',
				search: '',
			},
			{
				protocol: 'http',
				hostname: 'res.cloudinary.com',
				port: '',
				pathname: '/drpmyxx4c/image/upload/v1756647204/fastify_avatar/**',
				search: '',
			},
		],
	},
};

export default nextConfig;
