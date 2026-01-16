import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        const baseUrl = process.env.NEXT_PUBLIC_MERCHANT_SERVICE_BASE_URL || 'http://localhost:8080';
        return [
            {
                source: '/merchants/auth/:path*',
                destination: `${baseUrl}/merchants/auth/:path*`,
            },
        ];
    },
};

export default withNextIntl(nextConfig);