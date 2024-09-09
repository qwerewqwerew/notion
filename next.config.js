const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  staticPageGenerationTimeout: 300,
  images: {
    domains: [
      'www.notion.so',
      'notion.so',
      'images.unsplash.com',
      'pbs.twimg.com',
      'abs.twimg.com',
      's3.us-west-2.amazonaws.com',
      'coalacoding.com'
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: `
      default-src 'self';
      script-src 'none';
      sandbox;
      img-src 'self' data: https:;
    `,
    deviceSizes: [640, 768, 1024, 1280, 1600]
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false
      }
    }
    return config
  }
})
