import type { Request, Response } from 'express'
import {
  createProgressEntry,
  deleteProgressEntryById,
  listAllProgressEntries,
  listProgressByExercise,
  updateProgressEntryById,
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

export function getAllProgress(req: Request, res: Response) {
  const data = listAllProgressEntries()

  return res.status(200).json({
    data,
    message: 'Historial completo de progreso recuperado correctamente',
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

export function putProgressEntryById(req: Request, res: Response) {
  const id = getParamAsString(req.params.id)
  const { entry, error } = updateProgressEntryById(id, req.body ?? {})

  if (error) {
    const statusCode = error.includes('no encontrado') ? 404 : 400
    return res.status(statusCode).json({
      data: null,
      message: error,
    })
  }

  return res.status(200).json({
    data: entry,
    message: 'Registro de progreso actualizado correctamente',
  })
}

export function deleteProgressEntry(req: Request, res: Response) {
  const id = getParamAsString(req.params.id)
  const { deletedId, error } = deleteProgressEntryById(id)

  if (error) {
    return res.status(404).json({
      data: null,
      message: error,
    })
  }

  return res.status(200).json({
    data: { id: deletedId },
    message: 'Registro de progreso eliminado correctamente',
  })
}
