/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/lethal-calculator/:slug((?!$).*)',
                destination: '/lethal-calculator',
                permanent: true,
            },
        ]
    }
}

module.exports = nextConfig
