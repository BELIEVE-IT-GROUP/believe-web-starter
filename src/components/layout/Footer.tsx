'use client'

export function Footer() {
  return (
    <footer className="bg-gray-900 py-12 text-white">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center px-4 text-center">
        <p className="text-2xl font-bold">Believe</p>
        <p className="mt-4 text-gray-400">
          Construido con believe-web-starter
        </p>
        <div className="mt-6 flex gap-4 text-sm text-gray-400">
          <a href="#" className="hover:text-white">
            Privacy
          </a>
          <a href="#" className="hover:text-white">
            Terms
          </a>
        </div>
        <p className="mt-8 text-xs text-gray-500">
          © {new Date().getFullYear()} Believe Global. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
