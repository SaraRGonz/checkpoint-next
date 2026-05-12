# Documentación de la API (Endpoints Refactorizados)

Todos los endpoints han sido migrados para interactuar directamente con Neon PostgreSQL utilizando Prisma ORM.

## 1. Biblioteca General (Games)

### `GET /api/library`

Obtiene toda la biblioteca de juegos. Soporta búsqueda por título.

- **Query Params:** `?search=String` (Opcional)
- **Respuesta (200 OK):**

```json
    {
        "data": [
        {
            "id": "uuid",
            "title": "Juego Ejemplo",
            "status": "Completed",
            "platform": "PC",
            "genres": ["RPG", "Action"]
        }
        ],
        "total": 1
    }
```

### `POST /api/library`

Añade un nuevo juego a la biblioteca. Crea la Plataforma y el Género automáticamente si no existen.

- **Body:**

```json
    {
    "title": "Nuevo Juego",
    "status": "Wishlist",
    "coverUrl": "https://...",
    "platform": "PS5",
    "genres": ["Adventure"]
    }
```

- **Respuestas:** `201 Created` / `400 Bad Request` (Zod Validation)

## 2. Juego Específico

### `GET /api/library/[id]`
Obtiene los detalles completos de un juego por su UUID.

- **Respuestas:** `200 OK` / `404 Not Found`

### `PUT /api/library/[id]`
Actualiza parcialmente (PATCH method behavior) los campos de un juego.

- **Body (Todos opcionales):** `title`, `status`, `coverUrl`, `platform`, `rating`, `genres`, `releaseYear`.
- **Respuestas:** `200 OK` / `400 Bad Request` / `404 Not Found`

### `DELETE /api/library/[id]`
Elimina un juego de la biblioteca. Por configuración Cascade en Prisma, también elimina todo su historial de partidas (Playthroughs).

**Respuestas:** `204 No Content` / `404 Not Found`

## 3. Partidas (Playthroughs)
Endpoint segregado por Principio de Responsabilidad Única para gestionar el historial individual de cada partida.

### `PUT /api/playthroughs/[id]`
Actualiza el estado y metadatos de una partida en curso o finalizada.

**Body (Todos opcionales):**

```json
    {
    "status": "PLAYING",
    "rating": 5,
    "notes": "Llegando al boss final",
    "characterName": "Arthur",
    "endDate": "2026-05-12T10:00:00.000Z",
    "platformId": "uuid-de-la-plataforma"
    }
```

