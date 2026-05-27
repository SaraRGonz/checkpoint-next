# Estrategia de testing: Checkpoint

Basado en la Pirámide de Testing, se prioriza la velocidad y fiabilidad aislando responsabilidades:

1. **Unitario (Base - Vitest):** Rápido, aislado.
   - **Zustand (`ui-store.ts`):** Validar mutaciones de estado efímero (filtros, modo vista).
   - **Utilidades (`formatters.ts`):** Validar transformación de datos puros.
   - **Hooks (`useFilters.ts`):** Validar lógica de filtrado de arrays.

2. **Integración (Medio - React Testing Library + MSW):** Unión de capas.
   - Simular red con MSW (`/api/library`).
   - Renderizar componentes de UI complejos (`WishlistClient`, `PlaythroughSection`).
   - Validar interacciones del usuario (clics) y actualizaciones optimistas del DOM.

3. **E2E (Cúspide - Playwright):** Lento, alta confianza.
   - Flujos críticos completos en navegador real (Chromium, Firefox y Webkit).
   - Ejemplo: Login -> Buscar en RAWG -> Añadir -> Ver en Librería.