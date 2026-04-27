import { NavLink } from 'react-router-dom'
import { useWorkout } from '../hooks/useWorkout'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-gym-accent text-gym-bg'
      : 'text-gym-muted hover:bg-gym-surface hover:text-white',
  ].join(' ')

export default function NavBar() {
  const { activeRoutine } = useWorkout()

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
        <nav className="flex flex-wrap gap-1">
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
        </nav>
      </div>
    </header>
  )
}
