import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const inputClass =
  'w-full rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signInWithEmail, supabaseReady, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    if (!email.trim() || !password) {
      setError('Introduce email y contraseña')
      return
    }
    setSubmitting(true)
    const result = await signInWithEmail(email, password)
    setSubmitting(false)
    if (result.error) {
      setError(result.error)
      return
    }
    navigate(from, { replace: true })
  }

  if (!supabaseReady) {
    return (
      <div className="mx-auto max-w-md p-4">
        <h1 className="text-2xl font-semibold text-white">Iniciar sesión</h1>
        <p className="mt-3 text-sm text-gym-muted">
          Supabase no está configurado. Añade{' '}
          <code className="text-gym-accent">VITE_SUPABASE_URL</code> y{' '}
          <code className="text-gym-accent">VITE_SUPABASE_ANON_KEY</code> en tu entorno
          para habilitar cuentas.
        </p>
        <Link to="/" className="mt-6 inline-block text-sm text-gym-accent hover:underline">
          Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="text-2xl font-semibold text-white">Iniciar sesión</h1>
      <p className="mt-2 text-sm text-gym-muted">
        Accede con tu email. El modo invitado sigue disponible sin cuenta.
      </p>

      <form
        className="mt-6 space-y-4 rounded-lg border border-gym-border bg-gym-surface p-4"
        onSubmit={(e) => void handleSubmit(e)}
      >
        <div>
          <label className="mb-1 block text-sm text-gym-muted" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting || loading}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gym-muted" htmlFor="login-password">
            Contraseña
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting || loading}
          />
        </div>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting || loading}
          className="w-full rounded-md bg-gym-accent px-4 py-2 text-sm font-medium text-gym-bg disabled:opacity-50"
        >
          {submitting ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gym-muted">
        <Link to="/auth/forgot" className="text-gym-accent hover:underline">
          ¿Olvidaste la contraseña?
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-gym-muted">
        ¿No tienes cuenta?{' '}
        <Link to="/auth/register" className="text-gym-accent hover:underline">
          Crear cuenta
        </Link>
      </p>
      <p className="mt-6 text-center">
        <Link to="/" className="text-sm text-gym-muted hover:text-white">
          Volver al inicio
        </Link>
      </p>
    </div>
  )
}
