import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    output: 'standalone',
    async rewrites() {
        const baseUrl =
            process.env.MERCHANT_SERVICE_BASE_URL ??
            process.env.NEXT_PUBLIC_MERCHANT_SERVICE_BASE_URL;

        if (!baseUrl) {
            throw new Error(
                'Missing env var: MERCHANT_SERVICE_BASE_URL (recommended) or NEXT_PUBLIC_MERCHANT_SERVICE_BASE_URL. Define it (e.g. http://localhost:8083) and restart/redeploy.'
            );
        }

        console.log('✅ Rewrites base URL', baseUrl);
        return [
            {
                source: '/merchants/auth/:path*',
                destination: `${baseUrl}/merchants/auth/:path*`,
            },
            {
                source: '/api/v1/merchants/auth/:path*',
                destination: `${baseUrl}/api/v1/merchants/auth/:path*`,
            },
        ];
    },
};

export default withNextIntl(nextConfig);