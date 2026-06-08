# ADR-002: Neon DB (PostgreSQL Serverless) con Prisma ORM

## Estado: Aceptado

## Contexto
El despliegue de la aplicación se realiza en **Vercel**, el cual utiliza funciones Serverless (Server Actions y API Routes). En un entorno serverless, cada petición puede levantar una nueva instancia de la función, abriendo una nueva conexión a la base de datos. Una base de datos PostgreSQL tradicional tiene un límite estricto de conexiones concurrentes (ej. 100). En picos de tráfico, Vercel agotaría este límite instantáneamente, bloqueando la app (error de *Connection Pooling*).

## Decisión
Utilizar **Neon DB**, un proveedor de PostgreSQL diseñado específicamente para arquitecturas serverless, integrado mediante **Prisma ORM** con el adaptador `@prisma/adapter-pg` y un `Pool` de conexiones de `pg`. La instancia de Prisma se inicializa en un singleton global (`globalThis`) para evitar múltiples instancias en desarrollo con hot reload de Next.js.

## Consecuencias positivas
- **Connection Pooling Nativo:** Neon gestiona conexiones eficientemente vía `pg.Pool`, permitiendo escalar a múltiples funciones serverless simultáneas sin agotar el límite de conexiones.
- **Scale to Zero:** La base de datos no consume recursos si no recibe tráfico.
- **Compatibilidad con Prisma:** Neon funciona con `@prisma/adapter-pg`, habilitando el driver adapter mode de Prisma 7.
- **Fuente de verdad única de usuario:** Tanto el flujo GitHub OAuth como el flujo Firebase Credentials hacen upsert a Neon DB, centralizando el perfil de usuario (nombre, imagen, `imagePosition`, `hasSeenTutorial`) en un solo lugar.

## Compromisos
- **Latencia de arranque (Cold Start):** Si la base de datos ha escalado a cero por inactividad, la primera consulta puede tardar entre 1 y 3 segundos en levantar la instancia computacional.
- Vendor lock-in parcial a ecosistemas de bases de datos serverless.

## Alternativas descartadas
- **AWS RDS / PostgreSQL tradicional:** Requeriría desplegar un proxy externo (`pgbouncer`) manualmente para manejar el connection pool, añadiendo complejidad de infraestructura innecesaria.
- **Supabase:** Descartado porque el proyecto utiliza una arquitectura de autenticación en dos capas: Firebase Identity Toolkit como proveedor de identidad para credenciales email/password, y NextAuth como capa de sesión JWT unificada para ambos flujos (Firebase Credentials + GitHub OAuth). Supabase incluye su propio sistema de auth que colisionaría con esta arquitectura, añadiendo redundancia innecesaria.