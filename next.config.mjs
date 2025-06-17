/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'i1.ytimg.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'i2.ytimg.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'i3.ytimg.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'i4.ytimg.com',
                port: '',
                pathname: '/**',
            }
        ],
    },
    // Performance optimizations
    poweredByHeader: false,
    compress: true,
    reactStrictMode: true,
    swcMinify: true,
    // Remove allowDevelopmentBuild for production builds
    // experimental: {
    //     allowDevelopmentBuild: true
    // }
};

export default nextConfig;
