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
    experimental: {
        serverComponentsExternalPackages: ['libxmljs'],
    },
}

module.exports = nextConfig
