import { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Believe Agency',
  description: 'Web construida con believe-web-starter',
}

export default async function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">believe-web-starter</h1>
        <p className="mt-4 text-gray-600">
          Conectado a cms.believe-global.com
        </p>
      </div>
    </div>
  )
}
