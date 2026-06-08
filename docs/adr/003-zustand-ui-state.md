# ADR-003: Zustand para Gestión del Estado Global de UI

## Estado: Aceptado

## Contexto
Checkpoint requiere compartir estado visual en múltiples capas de la aplicación: barra de búsqueda, filtros por género/plataforma/rating/status, modo de vista (Grid vs Kanban) y opción de ordenación. Pasar estos datos mediante *Prop Drilling* ensucia el código. Usar la API nativa de React Context generaba un problema grave: cada vez que el usuario escribía una letra en el buscador, todos los componentes envueltos en el Context se volvían a renderizar, hundiendo el rendimiento.

## Decisión
Adoptar **Zustand** para la gestión del estado global del lado del cliente (UI State), mediante un único store (`useUIStore`) que centraliza filtros, ordenación, modo de vista y la query de búsqueda. Los consumidores suscriben únicamente los campos que necesitan usando selectores con `useShallow` para evitar re-renders innecesarios por comparación de referencia de objetos.

## Consecuencias positivas
- **Renderizados precisos:** Un componente solo se re-renderiza si el campo exacto que consume cambia. En `use-games.ts`, el objeto `filters` se lee con `useShallow` para que TanStack Query no dispare un refetch por una nueva referencia de objeto con los mismos valores.
- **Cero boilerplate:** No se requieren `Providers` envolviendo toda la app en `layout.tsx`. El store se importa y consume directamente.
- **Persistencia automática del estado UI:** El middleware `persist` de Zustand serializa todo el store en `localStorage` bajo la clave `ui-storage`. El usuario conserva entre sesiones su modo de vista, filtros activos, ordenación y búsqueda.
- **Sincronización con URL:** `useFilters.ts` mantiene los filtros del store sincronizados bidireccionalmente con los query params de la URL, permitiendo URLs compartibles y navegación con historial.

## Compromisos
- Dependencia externa frente al uso de herramientas nativas de React.
- El middleware `persist` serializa todo el store por defecto (sin `partialize`), incluyendo filtros y búsqueda activa. Un usuario que vuelva a la app días después puede encontrarse con filtros activos de su sesión anterior.
- El estado persistido en `localStorage` puede generar ligeros desajustes de hidratación en SSR si los valores diferieren del estado inicial del servidor, aunque se mitiga con los valores por defecto del store.

## Alternativas descartadas
- **React Context API:** Descartado por el antipatrón de re-renderizados en cascada. Habría requerido memorizar excesivamente con `useMemo` y `useCallback` en cada consumidor.
- **Redux Toolkit:** Descartado por ser excesivamente verboso. El estado global de UI en Checkpoint es simple (6 filtros + viewMode) y no justifica la sobrecarga de actions, reducers y slices de Redux.