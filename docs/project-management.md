# Gestión del proyecto

## Metodología de trabajo

Para organizar el desarrollo se usó un enfoque ágil, combinando:

- **Backlog priorizado** con tareas de valor para el MVP.
- **Trabajo incremental** en bloques pequeños de funcionalidad.
- **Revisión continua** del avance técnico y funcional.

## Tablero de Trello

Tablero del proyecto:

- https://trello.com/b/5MnwVGzY/trackmylift

Columnas usadas:

- **Backlog**: ideas y tareas pendientes de priorizar.
- **Todo**: tareas listas para iniciar.
- **In Progress**: tareas en desarrollo.
- **Review**: tareas implementadas pendientes de validación.
- **Done**: tareas terminadas y verificadas.

## Organización de tareas

Cada funcionalidad principal se dividió en tarjetas y, dentro de ellas, en subtareas técnicas:

- Definición de tipos TypeScript.
- Implementación de UI (páginas/componentes).
- Integración con hooks o contexto.
- Integración con API (cuando aplica).
- Validación de formularios y estados de error.
- Documentación en `docs/`.

## Flujo de trabajo aplicado

1. Se prioriza una funcionalidad en Backlog.
2. Se mueve a Todo cuando está definida.
3. Se desarrolla en In Progress.
4. Se valida manualmente en Review.
5. Si cumple criterios, pasa a Done.

## Criterios de "Done"

Una tarea se considera finalizada cuando:

- Funciona en frontend y, si aplica, en backend.
- Tiene manejo básico de estados (`loading`, `success`, `error`).
- No rompe rutas ni navegación existente.
- Está documentada en la carpeta `docs/`.
