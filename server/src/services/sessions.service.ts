import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export interface Session {
  id: string
  routineId: string
  routineName: string
  date: string
  notes?: string
}

export interface CreateSessionInput {
  routineId?: unknown
  routineName?: unknown
  date?: unknown
  notes?: unknown
}

export type UpdateSessionInput = CreateSessionInput

export interface PatchSessionInput {
  routineId?: unknown
  routineName?: unknown
  date?: unknown
  notes?: unknown
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDirectory = path.resolve(__dirname, '../../data')
const sessionsDataFile = path.resolve(dataDirectory, 'sessions.json')

function ensureDataDirectory(): void {
  if (!existsSync(dataDirectory)) {
    mkdirSync(dataDirectory, { recursive: true })
  }
}

function loadSessionsStore(): Session[] {
  try {
    ensureDataDirectory()

    if (!existsSync(sessionsDataFile)) {
      return []
    }

    const raw = readFileSync(sessionsDataFile, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((item): item is Session => {
      if (typeof item !== 'object' || item === null) return false
      const candidate = item as Partial<Session>
      return (
        typeof candidate.id === 'string' &&
        typeof candidate.routineId === 'string' &&
        typeof candidate.routineName === 'string' &&
        typeof candidate.date === 'string' &&
        (candidate.notes === undefined || typeof candidate.notes === 'string')
      )
    })
  } catch {
    return []
  }
}

function persistSessionsStore(store: Session[]): void {
  try {
    ensureDataDirectory()
    writeFileSync(sessionsDataFile, JSON.stringify(store, null, 2), 'utf8')
  } catch {
    // Evitamos romper la API por errores de escritura.
  }
}

const sessionsStore: Session[] = loadSessionsStore()

function isValidIsoDate(value: string): boolean {
  return !Number.isNaN(Date.parse(value))
}

function buildSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `session_${Date.now()}_${Math.floor(Math.random() * 10000)}`
}

function validateCreateSessionInput(input: CreateSessionInput): string | null {
  if (typeof input.routineId !== 'string' || input.routineId.trim().length === 0) {
    return 'routineId es obligatorio'
  }

  if (
    typeof input.routineName !== 'string' ||
    input.routineName.trim().length === 0
  ) {
    return 'routineName es obligatorio'
  }

  if (typeof input.date !== 'string' || !isValidIsoDate(input.date)) {
    return 'date debe ser una fecha ISO válida'
  }

  if (input.notes !== undefined && typeof input.notes !== 'string') {
    return 'notes debe ser texto'
  }

  return null
}

function normalizeNotes(notes: unknown): string | undefined {
  if (typeof notes !== 'string') return undefined
  const trimmedNotes = notes.trim()
  return trimmedNotes.length > 0 ? trimmedNotes : undefined
}

function validatePatchSessionInput(input: PatchSessionInput): string | null {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return 'Body inválido para actualización parcial'
  }

  const hasAnyField =
    input.routineId !== undefined ||
    input.routineName !== undefined ||
    input.date !== undefined ||
    input.notes !== undefined

  if (!hasAnyField) {
    return 'Debes enviar al menos un campo para actualizar'
  }

  if (input.routineId !== undefined) {
    if (typeof input.routineId !== 'string' || input.routineId.trim().length === 0) {
      return 'routineId debe ser texto no vacío'
    }
  }

  if (input.routineName !== undefined) {
    if (
      typeof input.routineName !== 'string' ||
      input.routineName.trim().length === 0
    ) {
      return 'routineName debe ser texto no vacío'
    }
  }

  if (input.date !== undefined) {
    if (typeof input.date !== 'string' || !isValidIsoDate(input.date)) {
      return 'date debe ser una fecha ISO válida'
    }
  }

  if (input.notes !== undefined && typeof input.notes !== 'string') {
    return 'notes debe ser texto'
  }

  return null
}

export function listSessions(): Session[] {
  return [...sessionsStore].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

export function createSession(
  input: CreateSessionInput,
): { session?: Session; error?: string } {
  const validationError = validateCreateSessionInput(input)
  if (validationError) {
    return { error: validationError }
  }

  const routineId = input.routineId as string
  const routineName = input.routineName as string
  const date = input.date as string

  const session: Session = {
    id: buildSessionId(),
    routineId: routineId.trim(),
    routineName: routineName.trim(),
    date,
    notes: normalizeNotes(input.notes),
  }

  sessionsStore.push(session)
  persistSessionsStore(sessionsStore)
  return { session }
}

export function replaceSessionById(
  id: string,
  input: UpdateSessionInput,
): { session?: Session; error?: string; notFound?: boolean } {
  const validationError = validateCreateSessionInput(input)
  if (validationError) {
    return { error: validationError }
  }

  const index = sessionsStore.findIndex((session) => session.id === id)
  if (index === -1) {
    return { notFound: true }
  }

  const routineId = input.routineId as string
  const routineName = input.routineName as string
  const date = input.date as string

  const updatedSession: Session = {
    id,
    routineId: routineId.trim(),
    routineName: routineName.trim(),
    date,
    notes: normalizeNotes(input.notes),
  }

  sessionsStore[index] = updatedSession
  persistSessionsStore(sessionsStore)
  return { session: updatedSession }
}

export function patchSessionById(
  id: string,
  input: PatchSessionInput,
): { session?: Session; error?: string; notFound?: boolean } {
  const validationError = validatePatchSessionInput(input)
  if (validationError) {
    return { error: validationError }
  }

  const index = sessionsStore.findIndex((session) => session.id === id)
  if (index === -1) {
    return { notFound: true }
  }

  const routineId = input.routineId as string | undefined
  const routineName = input.routineName as string | undefined
  const date = input.date as string | undefined

  const currentSession = sessionsStore[index]
  const patchedSession: Session = {
    ...currentSession,
    ...(routineId !== undefined ? { routineId: routineId.trim() } : {}),
    ...(routineName !== undefined ? { routineName: routineName.trim() } : {}),
    ...(date !== undefined ? { date } : {}),
    ...(input.notes !== undefined ? { notes: normalizeNotes(input.notes) } : {}),
  }

  sessionsStore[index] = patchedSession
  persistSessionsStore(sessionsStore)
  return { session: patchedSession }
}

export function removeSessionById(id: string): boolean {
  const index = sessionsStore.findIndex((session) => session.id === id)
  if (index === -1) {
    return false
  }

  sessionsStore.splice(index, 1)
  persistSessionsStore(sessionsStore)
  return true
}
