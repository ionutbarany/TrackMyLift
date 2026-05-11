import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const inputClass =
  'w-full rounded-md border border-gym-border bg-gym-bg px-3 py-2 text-white outline-none focus:border-gym-accent'

export default function ForgotPassword() {
  const { requestPasswordReset, supabaseReady, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setInfo(null)
    if (!email.trim()) {
      setError('Introduce tu email')
      return
    }
    setSubmitting(true)
    const result = await requestPasswordReset(email)
    setSubmitting(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setInfo(
      'Si existe una cuenta con ese email, recibirás un enlace para restablecer la contraseña. Añade la URL de redirección en el panel de Supabase (Authentication → URL configuration).',
    )
  }

  if (!supabaseReady) {
    return (
      <div className="mx-auto max-w-md p-4">
        <h1 className="text-2xl font-semibold text-white">Recuperar contraseña</h1>
        <p className="mt-3 text-sm text-gym-muted">
          Supabase no está configurado. Añade las variables{' '}
          <code className="text-gym-accent">VITE_SUPABASE_*</code> en tu entorno.
        </p>
        <Link to="/" className="mt-6 inline-block text-sm text-gym-accent hover:underline">
          Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="text-2xl font-semibold text-white">Recuperar contraseña</h1>
      <p className="mt-2 text-sm text-gym-muted">
        Te enviaremos un enlace para elegir una nueva contraseña.
      </p>

      <form
        className="mt-6 space-y-4 rounded-lg border border-gym-border bg-gym-surface p-4"
        onSubmit={(e) => void handleSubmit(e)}
      >
        <div>
          <label className="mb-1 block text-sm text-gym-muted" htmlFor="forgot-email">
            Email
          </label>
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting || loading}
          />
        </div>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {info ? <p className="text-sm text-green-400">{info}</p> : null}
        <button
          type="submit"
          disabled={submitting || loading}
          className="w-full rounded-md bg-gym-accent px-4 py-2 text-sm font-medium text-gym-bg disabled:opacity-50"
        >
          {submitting ? 'Enviando…' : 'Enviar enlace'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gym-muted">
        <Link to="/auth/login" className="text-gym-accent hover:underline">
          Volver a iniciar sesión
        </Link>
      </p>
    </div>
  )
}
