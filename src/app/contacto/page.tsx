import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto — Believe Agency',
  description: 'Contactanos para tu próximo proyecto digital.',
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 md:text-5xl">Contacto</h1>
              <p className="mt-4 text-lg text-gray-500">
                ¿Tenés un proyecto en mente? Escribinos y te respondemos en menos de 24 horas.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">@</span>
                  <span className="text-gray-600">hello@believe-global.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">📍</span>
                  <span className="text-gray-600">Medellín, Colombia</span>
                </div>
              </div>
            </div>
            <form className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Nombre</label>
                  <input
                    type="text"
                    required
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Email</label>
                  <input
                    type="email"
                    required
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Asunto</label>
                <input
                  type="text"
                  required
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Mensaje</label>
                <textarea
                  rows={5}
                  required
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-primary-600 px-6 py-3 text-base font-medium text-white hover:bg-primary-700"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
