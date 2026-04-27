import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <p className="text-6xl font-bold text-gym-accent">404</p>
      <h1 className="mt-2 text-xl font-semibold text-white">Página no encontrada</h1>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-gym-accent px-4 py-2 text-sm font-medium text-gym-bg hover:opacity-90"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
