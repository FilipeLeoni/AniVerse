/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
    images: {
        domains: ['user-images.githubusercontent.com', 'github.com', 'seeklogo.com', 's4.anilist.co', 'lh3.googleusercontent.com', 'localhost']
    }
}

const withNextIntl = require('next-intl/plugin')(
    './i18n.ts'
  );

module.exports = withNextIntl(nextConfig);
