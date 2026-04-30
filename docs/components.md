# Componentes implementados

## `NavBar`

Barra principal de navegación con enlaces a las páginas clave de la app.

### Responsabilidad

- Navegar entre Dashboard, Rutinas, Sesión, Progreso y Explorar.
- Mostrar la rutina activa (cuando exista en contexto).

---

## `MyRoutines` (página)

Pantalla para gestionar rutinas personales.

### Responsabilidad

- Crear, editar y eliminar rutinas.
- Navegar al detalle de una rutina (`/routines/:id`).
- Mostrar estado vacío cuando no hay rutinas.

---

## `RoutineDetail` (página)

Pantalla de detalle de una rutina para gestionar sus ejercicios.

### Responsabilidad

- Añadir ejercicios con datos tipados (`sets`, `reps`, `weight`, `muscleGroup`).
- Editar y eliminar ejercicios existentes.
- Validar inputs en tiempo real.
- Buscar ejercicios en ExerciseDB y autocompletar el formulario.
- Persistir cambios usando `useRoutines` (`localStorage`).
