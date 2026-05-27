# Tests de integración: MSW vs Mocks Manuales

## Mocks de Jest/Vitest (vi.mock)
Sobrescriben implementaciones internas (ej: `global.fetch = vi.fn()`). 
- **Problema:** Acoplan el test al código. Si cambiamos `fetch` por `axios`, el test falla aunque la app funcione. Falsos positivos/negativos.

## Mock Service Worker (MSW)
Intercepta peticiones a nivel de red (Service Worker / Node HTTP interceptor).
- **Ventaja:** El componente hace la petición real. No sabe que está siendo mockeado.
- **Seguridad:** Los tests prueban el comportamiento real frente a respuestas de la API, haciéndolos resilientes a refactors internos.