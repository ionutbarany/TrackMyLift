import { Router } from 'express'
import { getExerciseSearch } from '../controllers/exercises.controller'

const exercisesRouter = Router()

exercisesRouter.get('/search', getExerciseSearch)

export default exercisesRouter
