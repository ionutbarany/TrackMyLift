import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

// Resolver siempre el .env en la raíz del repo (dos niveles por encima de server/src),
// así funciona aunque `cwd` al arrancar tsx/node sea distinto.
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..', '..')

dotenv.config({ path: path.join(repoRoot, '.env') })
dotenv.config()

if (!process.env.RAPIDAPI_KEY?.trim()) {
  console.warn(
    '[FitTrack] RAPIDAPI_KEY no está definida tras cargar .env. ¿Guardaste el archivo .env en la raíz del proyecto?',
  )
}
