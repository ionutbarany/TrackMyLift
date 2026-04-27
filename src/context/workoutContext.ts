import { createContext } from 'react'
import type { Routine, Session } from '../types'

export interface WorkoutContextType {
  activeRoutine: Routine | null
  setActiveRoutine: (routine: Routine | null) => void
  weekSessions: Session[]
  refreshSessions: () => void
}

export const WorkoutContext = createContext<WorkoutContextType | null>(null)
