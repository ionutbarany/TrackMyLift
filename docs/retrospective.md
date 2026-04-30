# Retrospectiva final

## Qué aprendí en este proyecto

Este proyecto me permitió conectar de forma práctica conceptos de frontend y backend en una misma aplicación:

- En frontend, consolidé React con TypeScript, especialmente en componentes tipados, formularios controlados, rutas y hooks personalizados.
- En backend, reforcé Express con arquitectura por capas (`routes`, `controllers`, `services`) y validación de datos en la frontera de red.
- En integración, aprendí a mantener un contrato de datos consistente entre cliente y servidor para evitar errores de tipado y de runtime.

## Cómo conecté frontend, backend y API

La integración se hizo mediante una capa de red tipada en `src/api/client.ts`, que centraliza todas las llamadas HTTP y traduce respuestas del backend al modelo de la UI.

El flujo general fue:

1. El usuario interactúa con formularios/páginas React.
2. Hooks personalizados llaman funciones del API client.
3. El backend procesa en controller + service y devuelve `data/message`.
4. La UI refleja estados de carga, éxito o error.

## Problemas principales encontrados

- Ajustar y mantener sincronizados los tipos entre frontend y backend.
- Definir validaciones claras para evitar datos inválidos desde formularios.
- Decidir qué datos mantener en `localStorage` y cuáles en backend.
- Gestionar correctamente estados de red en la interfaz para mejorar UX.

## Cómo utilicé IA durante el desarrollo

Usé IA como apoyo para:

- estructurar documentación técnica,
- revisar consistencia de arquitectura y contratos,
- acelerar redacción y organización de tareas.

La IA se utilizó como asistente, mientras que las decisiones de implementación y validación final se comprobaron en el proyecto real.

## Qué mejoraría en una siguiente iteración

- Añadir base de datos real para persistencia duradera.
- Completar endpoints REST de actualización (`PUT`/`PATCH`).
- Incorporar tests automáticos (unitarios e integración).
- Mejorar observabilidad y trazabilidad de errores en producción.
- Completar despliegue final con URLs públicas documentadas.
