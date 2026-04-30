# Diseño y arquitectura

## Visión general

TrackMyLift es una aplicación full stack dividida en dos capas:

- **Frontend**: React + TypeScript + Vite + Tailwind.
- **Backend/API**: Node.js + Express + TypeScript.

El frontend consume una API REST propia para sesiones, progreso y rutinas populares. Las rutinas personales se guardan en `localStorage` en esta fase del proyecto.

## Estructura de componentes principales

Componentes/páginas base:

- `NavBar`: navegación principal.
- `Dashboard`: vista inicial.
- `MyRoutines`: CRUD de rutinas personales.
- `RoutineDetail`: detalle de rutina y gestión de ejercicios.
- `LogSession`: registro de sesiones.
- `Progress`: consulta y alta de progreso por ejercicio.
- `ExploreRoutines`: consumo de rutinas populares desde backend.
- `NotFound`: fallback 404.

## Componentes reutilizables

Reutilización aplicada sobre todo mediante:

- Modelos tipados compartidos en `src/types/index.ts`.
- Hooks reutilizables para lógica de negocio (`useRoutines`, `useSessionLog`, `useProgress`).
- Layout y estilos consistentes con utilidades de Tailwind.

## Gestión de estado

Se usa una combinación de:

- **Estado local** con `useState` en formularios y pantallas.
- **Hooks personalizados** para encapsular lógica de datos y red.
- **Context API** (`WorkoutContext`) para estado global ligero (rutina activa y sesiones de semana).

## Diseño de backend/API

Base de endpoints:

- `GET /api/v1/routines/popular`
- `GET /api/v1/sessions`
- `POST /api/v1/sessions`
- `DELETE /api/v1/sessions/:id`
- `GET /api/v1/progress/:exercise`
- `POST /api/v1/progress`

Arquitectura por capas:

- `routes/`: define rutas HTTP.
- `controllers/`: adapta request/response.
- `services/`: lógica de negocio y validaciones.

Contrato de respuesta común:

```json
{
  "data": "...",
  "message": "..."
}
```

## Persistencia de datos

En esta fase:

- **Servidor (fuente de verdad)**:
  - sesiones de entrenamiento,
  - progreso por ejercicio,
  - catálogo interno de rutinas populares.
- **Cliente (`localStorage`)**:
  - rutinas personales del usuario.

Esta separación permite practicar arquitectura cliente-servidor real sin introducir todavía una base de datos.

## Flujo de datos (diagrama simple)

```text
[UI React]
   |
   v
[Hooks y API client en src/api/client.ts]
   |
   v
[Express routes -> controllers -> services]
   |
   v
[Stores en memoria / localStorage según tipo de dato]
```

## Decisiones clave

- Se priorizó claridad de arquitectura sobre complejidad.
- Se tipó el contrato frontend-backend para reducir errores de integración.
- Se documentaron endpoints y capa de red para facilitar mantenimiento y entrega académica.
