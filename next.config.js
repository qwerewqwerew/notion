// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const nextConfig = {
  staticPageGenerationTimeout: 600,
  images: {
    domains: [
      'www.notion.so',
      'notion.so',
      'images.unsplash.com',
      'pbs.twimg.com',
      'abs.twimg.com',
      's3.us-west-2.amazonaws.com'
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  experimental: {
    // largePageDataBytes: 128 * 1000, // 128KB by default
    largePageDataBytes: 128 * 100000 // 증가된 128MB로 설정
  }
}

module.exports = withBundleAnalyzer(nextConfig)
