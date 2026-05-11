import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useWorkout } from '../hooks/useWorkout'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-gym-accent text-gym-bg'
      : 'text-gym-muted hover:bg-gym-surface hover:text-white',
  ].join(' ')

const authLinkClass =
  'rounded-md px-3 py-2 text-sm font-medium text-gym-muted transition-colors hover:bg-gym-surface hover:text-white'

export default function NavBar() {
  const { activeRoutine } = useWorkout()
  const { user, loading, supabaseReady, signOut } = useAuth()

  return (
    <header className="border-b border-gym-border bg-gym-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-bold tracking-tight text-white">FitTrack</p>
          {activeRoutine ? (
            <p className="text-xs text-gym-muted">
              Rutina activa:{' '}
              <span className="text-gym-accent">{activeRoutine.name}</span>
            </p>
          ) : null}
        </div>
        <nav className="flex flex-wrap items-center gap-1">
          <NavLink to="/" className={linkClass} end>
            Inicio
          </NavLink>
          <NavLink to="/routines" className={linkClass}>
            Mis rutinas
          </NavLink>
          <NavLink to="/session" className={linkClass}>
            Registrar sesión
          </NavLink>
          <NavLink to="/progress" className={linkClass}>
            Progreso
          </NavLink>
          <NavLink to="/explore" className={linkClass}>
            Explorar
          </NavLink>
          <span className="mx-1 hidden h-6 w-px bg-gym-border sm:inline" aria-hidden />
          {!supabaseReady ? (
            <span className="px-2 text-xs text-gym-muted" title="Añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY">
              Cuenta: no configurada
            </span>
          ) : loading ? (
            <span className="px-2 text-xs text-gym-muted">Cuenta…</span>
          ) : user ? (
            <>
              <span
                className="max-w-[140px] truncate px-2 text-xs text-gym-muted sm:max-w-[200px]"
                title={user.email ?? undefined}
              >
                {user.email}
              </span>
              <button
                type="button"
                onClick={() => void signOut()}
                className={authLinkClass}
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className={authLinkClass}>
                Entrar
              </Link>
              <Link to="/auth/register" className={authLinkClass}>
                Registro
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
