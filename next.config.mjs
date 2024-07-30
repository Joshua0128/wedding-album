/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone',
	experimental: {
		appDir: true,
	},
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.externals.push('next/server')
		}
		return config
	},
}

export default nextConfig
