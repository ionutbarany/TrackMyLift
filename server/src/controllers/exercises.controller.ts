import type { Request, Response } from 'express'
import { searchExerciseCatalog } from '../services/exercises.service.js'

function normalizeQueryParam(value: unknown): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : ''
  return ''
}

export async function getExerciseSearch(req: Request, res: Response) {
  try {
    const query = normalizeQueryParam(req.query.q)
    const { data, error } = await searchExerciseCatalog(query)

    if (error) {
      return res.status(500).json({
        data: null,
        message: error,
      })
    }

    return res.status(200).json({
      data: data ?? [],
      message: `Ejercicios para "${query}" recuperados correctamente`,
    })
  } catch {
    return res.status(500).json({
      data: null,
      message: 'Error al buscar ejercicios',
    })
  }
}
