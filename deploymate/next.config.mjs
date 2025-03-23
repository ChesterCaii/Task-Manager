/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  basePath: '/Task-Manager', // Match your repository name
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Add trailing slashes for consistent routing
  eslint: {
    // Don't run ESLint during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't run type checking during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig; 