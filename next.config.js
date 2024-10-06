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
            }
        ]
    }
}

module.exports = nextConfig
