# Testing y validación manual

## Objetivo

Verificar que las funcionalidades principales del sistema funcionan correctamente en entorno local y que la experiencia de uso es estable.

## Pruebas ejecutadas

### Frontend

- Navegación entre rutas principales y ruta 404.
- CRUD de rutinas en `MyRoutines`.
- Gestión de ejercicios en `RoutineDetail` (crear, editar, eliminar, validaciones).
- Registro de sesión en `LogSession` con feedback de éxito/error.
- Consulta y alta de progreso en `Progress`.
- Carga de rutinas populares desde backend en `ExploreRoutines`.

### Backend/API

- `GET /api/v1/routines/popular`
- `GET /api/v1/sessions`
- `POST /api/v1/sessions`
- `DELETE /api/v1/sessions/:id`
- `GET /api/v1/progress/:exercise`
- `POST /api/v1/progress`

Se verificó respuesta JSON y códigos HTTP esperados en escenarios válidos y con datos inválidos (400/404).

## Calidad técnica

Comandos ejecutados:

- `npm run lint` -> OK
- `npm run build` -> OK

## Responsive y UX

- Se revisó layout con Tailwind en distintas vistas.
- Se comprobó que los formularios muestran mensajes de error y estados de carga.

## Incidencias detectadas y estado

- No se detectaron errores bloqueantes para la funcionalidad actual del MVP.
- Como mejora futura, se recomienda añadir tests automáticos (unitarios e integración) para hooks y capa API.
