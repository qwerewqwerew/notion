// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const nextConfig = {
  staticPageGenerationTimeout: 600,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.notion.so',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'notion.so',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'abs.twimg.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com',
        pathname: '/**'
      }
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  experimental: {
    //largePageDataBytes: 128 * 1000, // 128KB by default
    largePageDataBytes: 128 * 1000
  }
}

// @ts-ignore
module.exports = withBundleAnalyzer(nextConfig)
