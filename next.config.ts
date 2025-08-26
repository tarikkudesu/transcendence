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
		],
	},
};

export default nextConfig;
