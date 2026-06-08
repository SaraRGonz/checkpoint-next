# ADR-001: TanStack Query y Actualizaciones Optimistas (Optimistic UI)

## Estado: Aceptado

## Contexto
En Checkpoint, los usuarios interactúan constantemente con la interfaz gestionando el estado de sus juegos (moviéndolos entre columnas del tablero Kanban, añadiendo a Wishlist, etc.). Esperar la respuesta HTTP del servidor (Next.js API Routes -> Neon DB) introducía una latencia de ~200-500ms, lo que provocaba que la aplicación se sintiera lenta y poco reactiva.

## Decisión
Implementar **TanStack Query (React Query)** como gestor de estado asíncrono principal y utilizar su patrón de **Optimistic Updates** en las mutaciones de `use-games.ts`. Para el tablero Kanban específicamente, se añade un estado local mínimo (`pendingMove`) en `KanbanBoard` que actúa como override inmediato sobre los datos de TQ, eliminando el parpadeo visual causado por el gap asíncrono entre `updateGame()` y la propagación del `onMutate` de TQ a través del árbol de componentes.

## Implementación
La arquitectura de actualización optimista opera en dos capas:

**Capa 1 — TanStack Query (`use-games.ts`):** `onMutate` cancela queries en vuelo y actualiza la caché `['games', filters]` de forma síncrona. `onError` hace rollback a `previousGames`. `onSettled` invalida y refresca desde el servidor.

**Capa 2 — Override local (`KanbanBoard.tsx`):** `pendingMove` almacena únicamente `{ id, status }` del juego en tránsito. `displayGames` aplica el override sobre los datos de TQ para render inmediato sin parpadeo. `pendingMove` se limpia en el siguiente render en que TQ caché ya refleja el nuevo status, sin timeouts artificiales. `onDragCancel` limpia `pendingMove` para mantener consistencia si el servidor falla.

## Consecuencias positivas
- **Feedback instantáneo:** La UI reacciona en 0ms al mover un juego o cambiar un filtro, asumiendo que la petición al servidor tendrá éxito.
- **Rollback automático:** Si la petición falla, TQ revierte la caché vía `onError`; `pendingMove` ya está limpio en ese punto, por lo que la UI retrocede correctamente.
- **Sin parpadeo en drag-and-drop:** El override local cubre el gap asíncrono entre `updateGame()` y el re-render propagado desde TQ, eliminando el estado visual duplicado.
- **Caché y Revalidación:** Los datos se mantienen frescos mediante revalidación en segundo plano (`stale-while-revalidate`), eliminando la necesidad de recargar la página.

## Compromisos
- Aumento en la complejidad del código frontend: gestionar `onMutate`, `onError` y `onSettled` añade verbosidad a `use-games.ts`. El `pendingMove` en `KanbanBoard` añade una segunda fuente de verdad local, justificada pero que requiere sincronización cuidadosa con TQ.
- Mayor consumo de memoria en el navegador cliente para mantener la caché activa.

## Alternativas descartadas
- **Estado local completo en KanbanBoard (`localGames`):** Implementación inicial que duplicaba toda la lógica optimista ya presente en TQ. Eliminada por redundancia arquitectónica.
- **Estado local + useEffect:** Muy propenso a errores, difícil de sincronizar globalmente y sin rollback automático en caso de fallo.
- **SWR (de Vercel):** La API de mutaciones de TanStack Query es más robusta y declarativa para lidiar con colecciones complejas como el tablero Kanban.