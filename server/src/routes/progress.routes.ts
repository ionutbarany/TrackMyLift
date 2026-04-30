import { Router } from 'express'
import {
  getProgressByExercise,
  postProgressEntry,
} from '../controllers/progress.controller'

const progressRouter = Router()

progressRouter.get('/:exercise', getProgressByExercise)
progressRouter.post('/', postProgressEntry)

export default progressRouter
