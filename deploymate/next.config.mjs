/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  basePath: '/Task-Manager', // Match your repository name
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig; 