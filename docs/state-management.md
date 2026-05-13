# Gestión del estado 

En Checkpoint, se ha separado la gestión del estado en dos dominios distintos para mejorar el rendimiento, la escalabilidad y la experiencia de usuario: **Estado de UI** y **Estado del servidor**.

## 1. Estado de UI vs. Estado del servidor

### Estado de UI (Zustand)
El estado de la interfaz de usuario se refiere a datos interactivos y efímeros que pertenecen puramente al cliente. No tienen impacto ni contrapartida directa en la base de datos.
- **Herramienta:** Zustand (`src/stores/ui-store.ts`).
- **Qué gestiona:** Términos de búsqueda, filtros activos (estado, géneros, plataformas), opciones de ordenación y el modo de visualización preferido (Grid vs Kanban).
- **Por qué:** Permite un acceso rápido, síncrono y global desde cualquier componente. Al usar su middleware `persist`, podemos guardar preferencias visuales en el `localStorage` del navegador para que sobrevivan entre recargas, sin saturar la URL.

### Estado del servidor (TanStack Query)
El estado del servidor es una "caché front-end" que refleja y administra los datos asíncronos alojados en la base de datos remota.
- **Herramienta:** TanStack Query / React Query (`src/hooks/use-games.ts`).
- **Qué gestiona:** El catálogo de videojuegos (`games`), las banderas de carga (`isLoading`), los estados de error y las mutaciones asíncronas (crear, actualizar, borrar).
- **Por qué:** Extrae la lógica compleja de fetching del componente. Resuelve la deduplicación de peticiones, reintentos en caso de fallo, y facilita patrones avanzados como la **Actualización optimista**. En nuestro `KanbanBoard`, esto permite que las tarjetas se muevan de columna al instante en la UI, ejecutando la actualización en la BD en segundo plano y revirtiendo el cambio automáticamente con `rollback` si la red falla.

---

## 2. Control de caché: staleTime vs. gcTime

Para optimizar las llamadas a la base de datos Serverless (Neon DB) y reducir el *layout shift*, se han configurado parámetros globales en el `QueryClient` (`src/lib/query-client.ts`).

### `staleTime` (Tiempo de obsolescencia)
- **Configuración:** 60.000 ms (1 minuto).
- **Concepto:** Dicta cuánto tiempo los datos cacheados se consideran "frescos" y fiables.
- **En nuestro contexto:** Si se obtiene la librería de juegos y luego se navega a la Wishlist y se regresa al Dashboard en menos de un minuto, React Query **no hará otra petición a la API**. Usará los datos en memoria instantáneamente. Si pasa más de un minuto, los datos se marcan como "obsoletos" (`stale`), y React Query hará un *refetch* silencioso en segundo plano la próxima vez que el usuario enfoque la ventana o monte el componente, actualizando la UI sin mostrar pantallas de carga innecesarias.

### `gcTime` (Tiempo de Recolección de Basura)
- **Configuración:** 300.000 ms (5 minutos).
- **Concepto:** Dicta cuánto tiempo permanecen los datos inactivos en la memoria caché antes de ser eliminados (purga de RAM).
- **En nuestro contexto:** Si el usuario abandona por completo la vista de la librería (ningún componente está usando `useGames()`), comienza este temporizador. Si el usuario vuelve a la librería antes de 5 minutos, verá los juegos instantáneamente (posiblemente seguidos de una actualización de fondo si el `staleTime` expiró). Si pasan los 5 minutos, la caché se vacía para ahorrar memoria del navegador. En este escenario, al volver a la librería, el usuario sí verá el *spinner* de carga inicial (`isLoading = true`).