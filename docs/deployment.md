# Despliegue

## Objetivo

Publicar frontend y backend para poder usar la aplicación fuera de entorno local.

## Plataforma elegida

- **Vercel** para frontend (Vite + React + TypeScript).
- Backend Express desplegado en el mismo repositorio (según configuración de proyecto en Vercel).

## Variables de entorno

Variables usadas por el frontend:

- `VITE_API_URL`: URL pública de la API.

Variables usadas por el backend/API:

- `RAPIDAPI_KEY`: clave privada de RapidAPI para consultar ExerciseDB desde el servidor.

## Pasos de despliegue (resumen)

1. Conectar el repositorio de GitHub en Vercel.
2. Configurar proyecto frontend con build de Vite.
3. Configurar variables de entorno en Vercel:
   - `RAPIDAPI_KEY` (obligatoria para búsqueda de ejercicios).
   - `VITE_API_URL` solo si frontend y API van en dominios distintos.
4. Desplegar y validar que el frontend carga correctamente.
5. Verificar conectividad frontend -> API con operaciones reales (sesiones/progreso).

## Checklist post-despliegue

- Frontend accesible en URL pública.
- API accesible en URL pública.
- Rutas del cliente funcionan correctamente (incluida 404).
- Endpoints principales responden con códigos esperados.
- No hay errores críticos en consola del navegador.

## URLs del proyecto

> Actualizar cuando esté completado el despliegue final:

- Frontend: PENDIENTE
- API: PENDIENTE
