import { Router } from 'express'
import { getExerciseSearch } from '../controllers/exercises.controller.js'

const exercisesRouter = Router()

exercisesRouter.get('/search', getExerciseSearch)

export default exercisesRouter
