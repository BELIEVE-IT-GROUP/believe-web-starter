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
  // Modo standalone: un deploy de tenant cuya web es una landing standalone
  // (vive en /<slug>) setea NEXT_PUBLIC_STANDALONE_SLUG=<slug> y su raiz "/"
  // sirve esa landing. Asi web-birdman (STANDALONE_SLUG=birdman) muestra
  // /birdman en su dominio raiz. Sin la env, "/" es la home normal del tenant.
  async rewrites() {
    const slug = process.env.NEXT_PUBLIC_STANDALONE_SLUG
    // beforeFiles: la reescritura de "/" debe correr ANTES del filesystem routing,
    // si no la home del tenant (que existe) gana y el rewrite nunca aplica.
    return {
      beforeFiles: slug ? [{ source: '/', destination: `/${slug}` }] : [],
      afterFiles: [],
      fallback: [],
    }
  },
}

export default nextConfig
