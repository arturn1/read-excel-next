/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5121/:path*', // Proxy para a API .NET
        },
    ];
},
};

export default nextConfig;
  