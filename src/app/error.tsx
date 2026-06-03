'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">500</h1>
        <p className="mt-4 text-xl text-gray-600">Algo salió mal</p>
        <button
          onClick={reset}
          className="mt-6 rounded-full bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
