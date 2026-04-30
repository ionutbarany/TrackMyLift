export interface ProgressEntry {
  id: string
  exerciseName: string
  weight: number
  reps: number
  date: string
}

export interface CreateProgressInput {
  exerciseName?: unknown
  weight?: unknown
  reps?: unknown
  date?: unknown
}

const progressStore: ProgressEntry[] = []

function isValidIsoDate(value: string): boolean {
  return !Number.isNaN(Date.parse(value))
}

function buildProgressId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `progress_${Date.now()}_${Math.floor(Math.random() * 10000)}`
}

function validateCreateProgressInput(input: CreateProgressInput): string | null {
  if (
    typeof input.exerciseName !== 'string' ||
    input.exerciseName.trim().length === 0
  ) {
    return 'exerciseName es obligatorio'
  }

  if (typeof input.weight !== 'number' || Number.isNaN(input.weight) || input.weight < 0) {
    return 'weight debe ser un número válido mayor o igual a 0'
  }

  if (typeof input.reps !== 'number' || Number.isNaN(input.reps) || input.reps < 1) {
    return 'reps debe ser un número válido mayor o igual a 1'
  }

  if (typeof input.date !== 'string' || !isValidIsoDate(input.date)) {
    return 'date debe ser una fecha ISO válida'
  }

  return null
}

export function listProgressByExercise(exerciseName: string): ProgressEntry[] {
  const normalizedExercise = exerciseName.trim().toLowerCase()

  return progressStore
    .filter((entry) => entry.exerciseName.toLowerCase() === normalizedExercise)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function createProgressEntry(
  input: CreateProgressInput,
): { entry?: ProgressEntry; error?: string } {
  const validationError = validateCreateProgressInput(input)
  if (validationError) {
    return { error: validationError }
  }

  // Tras validar, normalizamos tipos para TypeScript.
  const exerciseName = input.exerciseName as string
  const weight = input.weight as number
  const reps = input.reps as number
  const date = input.date as string

  const entry: ProgressEntry = {
    id: buildProgressId(),
    exerciseName: exerciseName.trim(),
    weight,
    reps,
    date,
  }

  progressStore.push(entry)
  return { entry }
}
