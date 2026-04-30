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
