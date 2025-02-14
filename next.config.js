
const withPWA = require("next-pwa")({
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    register: true,
    skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/lethal-calculator/:slug((?!$).*)',
                destination: '/lethal-calculator',
                permanent: true,
            },
            // kustom-kompiler redirect everything except /kustom-kompiler/docs to /kustom-kompiler
            {
                source: '/kustom-kompiler/:slug((?!docs).*)',
                destination: '/kustom-kompiler',
                permanent: true,
            },
            {
                source: '/stratle/:slug((?!game|library).*)',
                destination: '/stratle/game',
                permanent: true,
            },
            {
                source: '/stratle',
                destination: '/stratle/game',
                permanent: true,
            }
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'helldivers.wiki.gg',
                port: '',
                pathname: '/**',
            }
        ]
    },
    serverExternalPackages: ['libxmljs'],
}

module.exports = withPWA(nextConfig);
