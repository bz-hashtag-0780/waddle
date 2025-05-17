/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	experimental: {
		appDir: true,
	},
	images: {
		domains: ['via.placeholder.com', 'raw.githubusercontent.com'],
	},
};

export default nextConfig;
