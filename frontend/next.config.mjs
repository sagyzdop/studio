/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://backend:8000/api/:path*', // Connect to host port
        },
      ];
    },
  };
  
  export default nextConfig;