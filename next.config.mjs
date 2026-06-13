/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Limita el paralelismo del build: evita "spawn EAGAIN" en VPS con CPU saturada.
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  eslint: {
    // El lint corre aparte; no debe tumbar un deploy de produccion.
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.believe-global.com',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
    ],
  },
}

export default nextConfig
