/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'openweathermap.org',
      'coinmarketcap.com',
      'disease.sh',
      'newsapi.org',
      'coingecko.com',
      'worldbank.org'
    ],
  },
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    OPEN_WEATHER_API_KEY: process.env.OPEN_WEATHER_API_KEY,
    ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY,
    NEWS_API_KEY: process.env.NEWS_API_KEY,
    COINGECKO_API_KEY: process.env.COINGECKO_API_KEY,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ]
  },
  webpack: (config: { resolve: { fallback: { fs: boolean; net: boolean; tls: boolean; }; }; }) => {
    config.resolve.fallback = { 
      fs: false,
      net: false, 
      tls: false 
    };
    return config;
  }
};

export default nextConfig;
