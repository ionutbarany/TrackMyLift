/**
 * Cliente HTTP hacia la API Express propia (FitTrack).
 * Las funciones concretas se añadirán en bloques posteriores.
 */

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3001'

export function getApiBaseUrl(): string {
  return API_BASE
}
