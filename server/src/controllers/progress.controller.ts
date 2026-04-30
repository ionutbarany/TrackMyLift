import type { Request, Response } from 'express'
import {
  createProgressEntry,
  listProgressByExercise,
} from '../services/progress.service.js'

function getParamAsString(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] ?? ''
  return param ?? ''
}

export function getProgressByExercise(req: Request, res: Response) {
  const exercise = getParamAsString(req.params.exercise)
  const data = listProgressByExercise(exercise)

  return res.status(200).json({
    data,
    message: `Historial de "${exercise}" recuperado correctamente`,
  })
}

export function postProgressEntry(req: Request, res: Response) {
  const { entry, error } = createProgressEntry(req.body ?? {})

  if (error) {
    return res.status(400).json({
      data: null,
      message: error,
    })
  }

  return res.status(201).json({
    data: entry,
    message: 'Registro de progreso creado correctamente',
  })
}
