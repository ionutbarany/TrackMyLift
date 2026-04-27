# 💡 Idea del Proyecto — FitTrack

## Problema que resuelve

La mayoría de personas que van al gimnasio con regularidad no tienen una forma sencilla de llevar un seguimiento de su progreso. Dependen de libretas en papel, hojas de cálculo genéricas o simplemente intentan recordar cuánto levantaron la semana anterior. Esto provoca entrenamientos inconsistentes, falta de motivación y ninguna visibilidad real de la mejora a lo largo del tiempo.

**FitTrack** nace para resolver esto: una aplicación web sencilla y enfocada donde el usuario pueda organizar sus rutinas de entrenamiento, registrar cada sesión y visualizar la evolución de sus pesos — todo en un mismo lugar.

---

## Usuario objetivo

**Personas aficionadas al gimnasio** que entrenan con regularidad (2–5 días por semana) y quieren seguir una rutina estructurada sin la complejidad de plataformas pensadas para atletas profesionales.

**Perfil del usuario:**
- Entrena en el gimnasio de forma habitual
- Quiere registrar su progreso (pesos, volumen, consistencia)
- No necesita análisis avanzados ni entrenador personal — solo un registro personal limpio y funcional

---

## Funcionalidades principales

| Funcionalidad | Descripción |
|---|---|
| 🗂️ **Mis rutinas** | Crear, editar y eliminar rutinas personalizadas (ej. Día de empuje, Día de tirón, Día de pierna) |
| 🏋️ **Gestión de ejercicios** | Añadir ejercicios a cada rutina con series, repeticiones y peso inicial |
| 📅 **Registro de sesiones** | Registrar una sesión de entrenamiento completada vinculada a una rutina, con notas opcionales |
| 📈 **Progreso de pesos** | Ver el historial de peso levantado por ejercicio para seguir la progresión |
| 🌍 **Explorar rutinas** | Navegar por una lista curada de rutinas populares predefinidas (PPL, Full Body, Upper/Lower) que pueden usarse como inspiración |

---

## Funcionalidades opcionales

- 📊 **Gráfica de progreso** — gráfico visual de la evolución del peso por ejercicio a lo largo del tiempo
- 🔥 **Racha de entrenamiento** — mostrar cuántas semanas consecutivas ha entrenado el usuario
- 📝 **Notas de sesión** — añadir una nota personal a cada sesión ("me sentí fuerte", "poco descanso")
- 💪 **Filtro por grupo muscular** — filtrar ejercicios por grupo muscular (pecho, espalda, piernas, hombros, etc.)

---

## Mejoras futuras

- 🔐 **Autenticación real** — cuentas de usuario con JWT para que cada persona tenga sus datos privados
- 📱 **Aplicación móvil** — versión en React Native para registrar sesiones directamente en el gimnasio
- 🤝 **Compartir rutinas** — permitir a los usuarios publicar y compartir sus rutinas con la comunidad
- 🤖 **Sugerencias con IA** — recomendar rutinas según los objetivos y los días disponibles del usuario

---

## Decisiones técnicas

### Estrategia de persistencia de datos

| Dato | Almacenamiento | Motivo |
|---|---|---|
| Rutinas personales | `localStorage` (cliente) | Son privadas del usuario, no requieren inicio de sesión |
| Rutinas populares/predefinidas | API Express (servidor) | Son datos compartidos gestionados de forma centralizada |
| Sesiones de entrenamiento | API Express (servidor) | Necesitan persistir de forma fiable, con soporte futuro multidispositivo |
| Registros de progreso de pesos | API Express (servidor) | Funcionalidad principal, debe ser fiable y consultable |

> **No se usa base de datos** en esta versión. El backend Express almacena los datos en memoria o en un fichero JSON, manteniendo la configuración simple mientras se practica una arquitectura cliente–servidor real.

### ¿Por qué no se usa una API externa?

FitTrack está construido alrededor de **datos generados por el usuario** — las rutinas y las sesiones son personales y no pueden provenir de una fuente externa. Esto hace que el proyecto sea más realista como aplicación full stack, ya que el backend Express es la verdadera fuente de verdad, no un simple proxy hacia un servicio de terceros.

---

## Repositorio

- **GitHub:** https://github.com/ionutbarany/TrackMyLift
- **Tablero de proyecto (Trello):** https://trello.com/b/5MnwVGzY/trackmylift
- **Frontend en producción:** *(añadir una vez desplegado)*
- **API en producción:** *(añadir una vez desplegada)*

---

