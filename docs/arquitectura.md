# Arquitectura de Base de Datos

Este documento detalla el modelo relacional del proyecto Checkpoint y la configuración de conexión utilizando Neon (PostgreSQL Serverless) y Prisma ORM.

## 1. Modelo Relacional

La base de datos está diseñada para permitir a los usuarios gestionar su biblioteca de videojuegos y hacer un seguimiento detallado de sus partidas (Playthroughs). 

El modelo se compone de las siguientes entidades principales y sus relaciones:

* **Game (Juego):** Entidad central. Contiene los metadatos del juego (título, carátula, nota general, estado global en la biblioteca).
    * **Relación con Platform:** `1 a N` (Muchos juegos pertenecen a una plataforma principal).
    * **Relación con Genre:** `N a M` (Muchos juegos pueden tener muchos géneros). Se gestiona internamente por Prisma mediante una tabla pivot implícita `_GameToGenre`.
* **Platform (Plataforma):** Representa el hardware o ecosistema (PC, PS5, Switch). 
    * Se relaciona tanto con el `Game` (plataforma original del juego) como con el `Playthrough` (plataforma en la que se jugó esa partida concreta).
* **Genre (Género):** Entidad para clasificar los juegos (RPG, Action, Indie).
* **Playthrough (Partida):** Permite el registro de múltiples partidas para un mismo juego. Es vital para juegos altamente rejugables o multijugadores masivos.
    * **Relación con Game:** `N a 1` (Un juego puede tener múltiples partidas). Tiene configurado `onDelete: Cascade` para que, si un juego se borra de la biblioteca, se borre su historial de partidas.
    * Incluye campos específicos opcionales como `characterName` o `serverName`.

**Enums:**
Se utiliza un Enum `Status` para unificar los estados en la base de datos (`WISHLIST`, `QUEUE`, `PLAYING`, `COMPLETED`, `DROPPED`).

---

## 2. Configuración de Conexión: Pool vs Directa

Al utilizar una base de datos Serverless (Neon) junto con un framework moderno (Next.js App Router), es obligatorio gestionar las conexiones para no saturar el servidor de base de datos. Por ello, utilizamos dos variables de entorno distintas:

### `DATABASE_URL` (Connection Pooling)
* **Propósito:** Es la URL que utiliza la aplicación en tiempo de ejecución (Next.js / Prisma Client) para realizar las consultas CRUD (SELECT, INSERT, UPDATE, DELETE).
* **Por qué se usa:** En entornos Serverless, cada petición web puede levantar una nueva instancia temporal (un worker). Si cada worker abriera una conexión directa a la base de datos, el límite de conexiones de PostgreSQL se agotaría en segundos. La `DATABASE_URL` apunta a un **Connection Pooler** (como PgBouncer, integrado en Neon) que hace de intermediario, reutilizando un número pequeño de conexiones reales para atender miles de peticiones simultáneas.

### `DIRECT_URL` (Conexión Directa)
* **Propósito:** Es la URL que utiliza exclusivamente la CLI de Prisma en el entorno de desarrollo para ejecutar migraciones (`npx prisma migrate`).
* **Por qué se usa:** Las migraciones implican alterar la estructura de la base de datos (crear tablas, modificar columnas). Estas operaciones estructurales (DDL) requieren bloqueos a nivel de base de datos que no son compatibles con los intermediarios de Connection Pooling. Por lo tanto, para modificar el esquema, hay que saltarse el Pooler y hablar directamente con el motor de PostgreSQL.