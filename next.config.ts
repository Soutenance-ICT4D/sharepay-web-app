import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    output: 'standalone',
    async rewrites() {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8080/api/v1';
        return [
            {
                source: '/auth/:path*',
                destination: `${baseUrl}/auth/:path*`,
            },
            {
                source: '/merchants/apps/:path*',
                destination: `${baseUrl}/merchants/apps/:path*`,
            },
            {
                source: '/merchants/payment-links/:path*',
                destination: `${baseUrl}/merchants/payment-links/:path*`,
            },
            {
                source: '/payment-links/public/:path*',
                destination: `${baseUrl}/payment-links/public/:path*`,
            },
        ];
    },
};

export default withNextIntl(nextConfig);