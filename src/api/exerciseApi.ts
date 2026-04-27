/**
 * Cliente para ExerciseDB (RapidAPI).
 * La key se expone como VITE_RAPIDAPI_KEY en el entorno de Vite.
 */

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY

export function getRapidApiKey(): string | undefined {
  return RAPIDAPI_KEY
}
