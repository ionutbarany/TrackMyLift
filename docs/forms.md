# Formularios y validaciones

## `MyRoutines` (`/routines`)

Formulario para crear y editar rutinas personales.

### Campos

- `name` (obligatorio, mínimo 3 caracteres)
- `description` (opcional)
- `isPublic` (checkbox)

### Validaciones implementadas

- Validación en tiempo real del nombre de rutina.
- Mensaje inline cuando el nombre está vacío o es demasiado corto.
- Botón de envío deshabilitado si el formulario no es válido.

### Comportamiento

- En modo creación genera `id` y `createdAt` automáticamente.
- En modo edición conserva `id`, `createdAt` y `exercises`.
- Permite cancelar la edición y volver al estado inicial.

---

## `LogSession` (`/session`)

Formulario para registrar una sesión en backend.

### Campos

- `routineId` (obligatorio)
- `routineName` (obligatorio)
- `date` (obligatorio, convertido a ISO)
- `notes` (opcional)

### Feedback de UI

- Estado visual de carga (`Guardando...`).
- Mensaje de éxito tras registrar.
- Mensaje de error desde `errorMessage`.

---

## `Progress` (`/progress`)

Incluye dos formularios: búsqueda por ejercicio y alta de registro.

### Búsqueda

- Campo `exerciseName` obligatorio.
- Carga resultados desde API (`GET /api/v1/progress/:exercise`).

### Alta de progreso

- `exerciseName` obligatorio.
- `weight` numérico (mínimo 0).
- `reps` numérico (mínimo 1).
- `date` obligatorio (convertido a ISO).

### Feedback de UI

- Estado visual de carga.
- Mensajes de éxito y error.
- Estado vacío cuando no hay resultados.

---

## `RoutineDetail` (`/routines/:id`)

Formulario para gestionar ejercicios dentro de una rutina.

### Campos

- `name` del ejercicio (obligatorio, mínimo 2 caracteres)
- `muscleGroup` (selector tipado)
- `sets` (numérico, mínimo 1)
- `reps` (numérico, mínimo 1)
- `weight` (numérico, mínimo 0)
- `notes` (opcional)

### Validaciones implementadas

- Validación inline de nombre del ejercicio.
- Validación inline de series, repeticiones y peso.
- Botón de envío deshabilitado si hay errores.

### Comportamiento

- Permite crear ejercicio nuevo.
- Permite editar un ejercicio existente.
- Permite eliminar ejercicio.
- Permite buscar en ExerciseDB y usar un resultado para autocompletar nombre + grupo muscular.
- Sincroniza cambios usando `useRoutines` y `localStorage`.
