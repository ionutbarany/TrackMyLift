import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { WorkoutContext, type WorkoutContextType } from './workoutContext'

interface WorkoutProviderProps {
  children: ReactNode
}

export function WorkoutProvider({ children }: WorkoutProviderProps) {
  const [activeRoutine, setActiveRoutine] = useState(
    null as WorkoutContextType['activeRoutine'],
  )
  const [weekSessions] = useState<WorkoutContextType['weekSessions']>([])

  const refreshSessions = useCallback(() => {
    // Se conectará con useSessionLog / API en un bloque posterior.
  }, [])

  const value = useMemo<WorkoutContextType>(
    () => ({
      activeRoutine,
      setActiveRoutine,
      weekSessions,
      refreshSessions,
    }),
    [activeRoutine, refreshSessions, weekSessions],
  )

  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  )
}
