# Reflexión Final: Checkpoint

## 1. Cuál fue la parte del proyecto que más me costó y cómo la resolví.

El mayor reto técnico fue, por un lado, la infraestructura de testing en Next.js, por otro, la sincronización del estado entre capas en el tablero Kanban.

### La infraestructura de testing con Vitest + MSW

El ecosistema de Next.js App Router carece de estándares claros para testear componentes híbridos. Mockear `next-auth`, las cabeceras de sesión y las respuestas de la API externa de RAWG generaba colisiones constantes en el DOM y falsos positivos. TypeScript añadía fricción adicional con los tipos inferidos de Prisma en la frontera entre base de datos y UI.

La solución fue aislar la capa de red con **MSW (Mock Service Worker)**. Diseñé handlers globales que interceptan llamadas HTTP en el entorno Node de los tests. El archivo `setupTests.ts` centraliza los mocks críticos como el ciclo de vida del servidor MSW (`beforeAll`/`afterEach`/`afterAll`), los mocks estables de `next/navigation` (`useRouter`, `useSearchParams`, `usePathname`) y la sesión autenticada de `next-auth/react`. Esta arquitectura de setup permitió que los 104 tests corran de forma determinista, alcanzando más del 92% de cobertura de statements y el 94% de líneas sin tocar servidores reales ni consumir cuotas de API.

### El parpadeo visual en el Kanban y la sincronización de estado

Al implementar el Drag & Drop con `dnd-kit` sobre TanStack Query, la interfaz mostraba un parpadeo al soltar una tarjeta. El juego aparecía brevemente en ambas columnas antes de estabilizarse. El problema era el gap asíncrono entre `updateGame()` y la propagación del `onMutate` de TQ a través del árbol de componentes.

La solución fue una arquitectura de actualización optimista en dos capas. La primera capa vive en `use-games.ts`. Dentro de este archivo, `onMutate` cancela queries en vuelo y actualiza la caché `['games', filters]` síncronamente, con rollback automático en `onError`. La segunda capa vive en `KanbanBoard.tsx`. Aquí un estado mínimo `pendingMove` (`{ id, status }`) actúa como override inmediato sobre los datos de TQ para el render, cubriéndo el gap sin duplicar toda la lógica optimista. `pendingMove` se limpia solo en el siguiente render en que TQ ya refleja el nuevo status, sin timeouts artificiales, con limpieza en `onDragCancel` para mantener consistencia ante fallos del servidor.

---

## 2. Si tuviera que rehacer el proyecto desde cero mañana, ¿qué decisión técnica cambiaría?

### Diseño "Data-First" desde el día 0

Cambiaría haber empezado con datos mockeados antes de definir la base de datos real. La transición del mock a Prisma + Neon requirió refactorizar múltiples endpoints, ajustar tipos en la frontera DB↔UI y gestionar migraciones complejas. Si empezara de nuevo, diseñaría el esquema de Prisma y levantaría la infraestructura en Neon desde el primer commit, desarrollando los componentes directamente contra contratos de API reales y tipos definitivos.

### Reemplazar la autenticación híbrida por Auth.js v5 nativo

El flujo actual (NextAuth como orquestador + Firebase Identity Toolkit REST para credenciales + GitHub OAuth) es seguro y funcional, pero introduce una dependencia externa fragmentada. Cada login con email/password genera una llamada HTTP server-to-server a Firebase antes de llegar a Prisma, añadiendo latencia en la ruta crítica y obligando a mapear manualmente los errores de Firebase en el backend de NextAuth.

La alternativa sería implementar **Auth.js (NextAuth v5)** con su adaptador nativo de Prisma desde el día 1 para gestionar las credenciales con hashing via `argon2` directamente en PostgreSQL, sin dependencias externas en el flujo de autenticación. Esto eliminaría la llamada HTTP a Firebase, unificaría el modelo de usuario en una sola fuente de verdad y reduciría la superficie de error.

---

## 3. ¿Cómo explicarías la arquitectura de este sistema en una entrevista técnica?

Checkpoint sigue una arquitectura full-stack en capas con responsabilidades bien delimitadas.

**Capa de cliente.** El estado se divide según su naturaleza. El estado de UI puro (filtros, modo de vista, búsqueda) vive en **Zustand** con persistencia en `localStorage` via middleware `persist`. Los consumidores usan `useShallow` para suscribirse solo a los campos que necesitan, evitando re-renders por comparación de referencia de objetos. El estado servidor (datos de la librería, mutaciones) lo gestiona **TanStack Query**, que actúa como gestor de caché inteligente. Sirve datos cacheados instantáneamente y sincroniza con el servidor en segundo plano.

**Capa de servidor.** La aplicación corre en **Next.js App Router** sobre Vercel. Las mutaciones siguen dos vías según el caso de uso, añadir un juego manualmente usa un **Server Action** con `revalidatePath` para invalidar la caché del App Router, el resto de operaciones CRUD de la librería van por **API Routes** HTTP clásicas. El endpoint de búsqueda a RAWG actúa como proxy inverso que inyecta la `RAWG_API_KEY` en servidor (nunca expuesta al cliente), implementa caché nativa de Next.js de 24 horas (`revalidate: 86400`) y añade un rate limiter propio de 20 peticiones por minuto por IP con ventana deslizante en memoria.

**Capa de autenticación.** NextAuth orquesta dos flujos, GitHub OAuth directo y credenciales email/password validadas contra **Firebase Identity Toolkit** via REST server-to-server. Ambos flujos terminan en un `upsert` de Prisma en Neon, convirtiendo la base de datos PostgreSQL en la única fuente de verdad del perfil de usuario (nombre, avatar, preferencias).

**Capa de datos.** **Prisma ORM** con el adaptador `@prisma/adapter-pg` conecta a **Neon DB** (PostgreSQL serverless) via `pg.Pool`. La instancia de Prisma se inicializa como singleton en `globalThis` para evitar múltiples conexiones en el hot reload de desarrollo. Esta combinación resuelve el problema fundamental de los entornos serverless ya que Neon gestiona el connection pooling, evitando que los micro-servidores de Vercel agoten el límite de conexiones simultáneas de PostgreSQL.

**Optimización de assets.** Las imágenes de RAWG pasan por el optimizador de Next.js, Vercel descarga el original, lo convierte a WebP/AVIF, lo redimensiona al tamaño exacto del componente y lo cachea en CDN global. El cliente recibe imágenes optimizadas ahorrando hasta un 90% de ancho de banda frente al JPEG original.