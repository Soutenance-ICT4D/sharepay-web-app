import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    output: 'standalone',
    async rewrites() {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'https://sharepay-merchant-service-production.up.railway.app/api/v1';
        return [
            {
                source: '/merchants/auth/:path*',
                destination: `${baseUrl}/merchants/auth/:path*`,
            },
        ];
    },
};

export default withNextIntl(nextConfig);