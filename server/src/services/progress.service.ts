import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

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

export interface UpdateProgressInput {
  exerciseName?: unknown
  weight?: unknown
  reps?: unknown
  date?: unknown
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDirectory = path.resolve(__dirname, '../../data')
const progressDataFile = path.resolve(dataDirectory, 'progress.json')

function ensureDataDirectory(): void {
  if (!existsSync(dataDirectory)) {
    mkdirSync(dataDirectory, { recursive: true })
  }
}

function loadProgressStore(): ProgressEntry[] {
  try {
    ensureDataDirectory()

    if (!existsSync(progressDataFile)) {
      return []
    }

    const raw = readFileSync(progressDataFile, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((item): item is ProgressEntry => {
      if (typeof item !== 'object' || item === null) return false
      const candidate = item as Partial<ProgressEntry>
      return (
        typeof candidate.id === 'string' &&
        typeof candidate.exerciseName === 'string' &&
        typeof candidate.weight === 'number' &&
        typeof candidate.reps === 'number' &&
        typeof candidate.date === 'string'
      )
    })
  } catch {
    return []
  }
}

function persistProgressStore(store: ProgressEntry[]): void {
  try {
    ensureDataDirectory()
    writeFileSync(progressDataFile, JSON.stringify(store, null, 2), 'utf8')
  } catch {
    // Evitamos romper la API por errores de escritura.
  }
}

const progressStore: ProgressEntry[] = loadProgressStore()

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

export function listAllProgressEntries(): ProgressEntry[] {
  return [...progressStore].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
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
  persistProgressStore(progressStore)
  return { entry }
}

export function updateProgressEntryById(
  id: string,
  input: UpdateProgressInput,
): { entry?: ProgressEntry; error?: string } {
  const index = progressStore.findIndex((item) => item.id === id)
  if (index === -1) {
    return { error: 'Registro de progreso no encontrado' }
  }

  const validationError = validateCreateProgressInput(input)
  if (validationError) {
    return { error: validationError }
  }

  const updatedEntry: ProgressEntry = {
    id,
    exerciseName: (input.exerciseName as string).trim(),
    weight: input.weight as number,
    reps: input.reps as number,
    date: input.date as string,
  }

  progressStore[index] = updatedEntry
  persistProgressStore(progressStore)
  return { entry: updatedEntry }
}

export function deleteProgressEntryById(id: string): { deletedId?: string; error?: string } {
  const index = progressStore.findIndex((item) => item.id === id)
  if (index === -1) {
    return { error: 'Registro de progreso no encontrado' }
  }

  progressStore.splice(index, 1)
  persistProgressStore(progressStore)
  return { deletedId: id }
}
