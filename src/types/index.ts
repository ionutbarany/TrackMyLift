export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'glutes'
  | 'cardio'

export interface Exercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  sets: number
  reps: number
  weight: number
  notes?: string
}

export interface Routine {
  id: string
  name: string
  description?: string
  exercises: Exercise[]
  isPublic: boolean
  createdAt: string
}

export interface Session {
  id: string
  routineId: string
  routineName: string
  date: string
  notes?: string
}

export interface ProgressEntry {
  id: string
  exerciseName: string
  weight: number
  reps: number
  date: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'
