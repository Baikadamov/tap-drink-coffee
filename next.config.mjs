/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  // В Next.js 16 переименовано из experimental.serverComponentsExternalPackages
  serverExternalPackages: ['better-sqlite3'],
  // Пустая конфигурация Turbopack для подавления предупреждения
  turbopack: {},
}

export default nextConfig
