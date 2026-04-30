import { Router } from 'express'
import {
  deleteProgressEntry,
  getAllProgress,
  getProgressByExercise,
  postProgressEntry,
  putProgressEntryById,
} from '../controllers/progress.controller.js'

const progressRouter = Router()

progressRouter.get('/', getAllProgress)
progressRouter.get('/:exercise', getProgressByExercise)
progressRouter.post('/', postProgressEntry)
progressRouter.put('/:id', putProgressEntryById)
progressRouter.delete('/:id', deleteProgressEntry)

export default progressRouter
