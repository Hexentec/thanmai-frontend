/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com'],
        // (Optional in newer Next versions—use instead of `domains`)
        // remotePatterns: [
        //   {
        //     protocol: 'https',
        //     hostname: 'res.cloudinary.com',
        //     port: '',
        //     pathname: '/**',
        //   },
        // ],
    },
    // Remove allowDevelopmentBuild for production builds
    // experimental: {
    //     allowDevelopmentBuild: true
    // }
};

export default nextConfig;
