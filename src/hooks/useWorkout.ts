import { useContext } from 'react'
import { WorkoutContext, type WorkoutContextType } from '../context/workoutContext'

export function useWorkout(): WorkoutContextType {
  const ctx = useContext(WorkoutContext)
  if (!ctx) {
    throw new Error('useWorkout debe usarse dentro de WorkoutProvider')
  }
  return ctx
}
