import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    output: 'standalone',
    async rewrites() {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'https://72c329e07eaf.ngrok-free.app';
        return [
            {
                source: '/merchants/auth/:path*',
                destination: `${baseUrl}/merchants/auth/:path*`,
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