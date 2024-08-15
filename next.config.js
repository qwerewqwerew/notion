// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
	staticPageGenerationTimeout: 6000,
	images: {
		domains: ['www.notion.so', 'notion.so', 'images.unsplash.com', 'pbs.twimg.com', 'abs.twimg.com', 's3.us-west-2.amazonaws.com', 'www.figma.com'],
		formats: ['image/avif', 'image/webp', 'image/jpg', 'image/png', 'image/gif', 'image/jpeg'],
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.cache = false;
		}
		return config;
	},
});
const nextConfig = {
	reactStrictMode: false,
	experimental: {
		largePageDataBytes: 800 * 10000,
	},
};

module.exports = nextConfig;
