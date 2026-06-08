# 📝 Checkpoint — Full-Stack game management platform
> Sistema de gestión de colecciones de videojuegos profesional con sincronización optimista, arquitectura serverless, multi-tenant y pruebas automatizadas.

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=FFF)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

![Checkpoint Cover](public/checkpointlogo.svg) 

Checkpoint es una plataforma web fullstack para la gestión de colecciones de videojuegos. Diseñada como un organizador personal inmersivo, permite a los usuarios buscar títulos, gestionar su estado (Wishlist, Playing, Queue, Completed, Dropped), calificar sus juegos y escribir reseñas personales bajo una interfaz de estética "Gaming".

## Demo en vivo

* **Aplicación:** https://checkpoint-teal.vercel.app
* **Video demo técnica:**
* **Repositorio:** [GitHub - SaraRGonz/checkpoint-next](https://github.com/SaraRGonz/checkpoint-next)

---

## Arquitectura

El sistema utiliza una arquitectura *Serverless* orientada a componentes, donde el frontend y las API Routes coexisten en Vercel, delegando la persistencia a Neon DB y la autenticación a un flujo híbrido con NextAuth y Firebase.

```mermaid
graph TD
    Client[Navegador del Usuario\nReact + Zustand + React Query] -->|HTTP/REST| Vercel[Vercel Serverless\nNext.js App Router]
    
    subgraph Vercel
        ServerActions[Server Actions]
        ApiRoutes[API Routes]
    end
    
    Client -->|Autenticación| FirebaseAuth[Firebase Auth]
    Vercel -->|Prisma ORM| NeonDB[(Neon PostgreSQL\nBase de Datos Serverless)]
    Vercel -->|Fetch Data| RAWG[RAWG API\nCatálogo de Juegos]
    Vercel -.->|Sesiones| NextAuth[NextAuth.js]
```

*(Nota: Disponible la versión en imagen en ``docs/arquitectura/diagrama.png``)*

| Servicio | Tecnología | Despliegue |
| :--- | :--- | :--- |
| Aplicación Web (UI & API) | Next.js 16 (App Router) + Prisma | Vercel |
| Base de Datos Relacional | PostgreSQL | Neon DB |
| Autenticación | NextAuth.js + Firebase | Vercel / GCP |
| Datos Externos | API REST | RAWG.io |

## Decisiones Técnicas

| Decisión | Alternativas consideradas | Razón principal |
| :--- | :--- | :--- |
| **Neon DB** | AWS RDS, Supabase, SQLite local | Arquitectura serverless con *connection pooling* nativo. Evita que las Serverless Functions saturen las conexiones a la base de datos al escalar. |
| **Zustand** | React Context, Redux Toolkit | Evitar re-renders innecesarios mediante selectores precisos. Sintaxis limpia y nulo *boilerplate* para gestionar filtros de la UI global. |
| **TanStack Query** | `useEffect` + `fetch`, SWR | Gestión avanzada de caché y **Optimistic Updates** para el Kanban (Drag & Drop), permitiendo una interfaz que reacciona sin latencia. |
| **next-themes** | Contexto manual c/ `localStorage` | Previene el problema de hidratación y el destello visual (*FOIT* - Flash of Incorrect Theme) en entornos de Server-Side Rendering (SSR). |

## Características Principales

- **Persistencia y Aislamiento (Multi-tenant):** Arquitectura robusta con PostgreSQL y Prisma ORM. Cada usuario tiene su propia base de datos aislada, garantizando privacidad total.
- **Autenticación Segura:** Sistema de login completo usando NextAuth, Firebase Authentication (Email/Password) y OAuth (GitHub).
- **Búsqueda Integrada con RAWG:** Escaneo de la base de datos de RAWG API con filtros por plataforma, género y año para añadir juegos rápidamente.
- **Tablero Kanban Interactivo:** Sistema *Drag and Drop* intuitivo con actualizaciones optimistas (Optimistic UI) para cambiar el estado de los juegos sin tiempos de carga.
- **Personalización de Librería:** Edición de metadatos del juego, sistema de puntuación, notas enriquecidas, registro de playthroughs, y reposicionamiento manual de carátulas.

---

## Tecnologías

| Frontend | Uso |
|----------|-----|
| **React 19** | Renderizado de UI y gestión de componentes cliente/servidor |
| **Tailwind CSS v4** | Estilizado semántico basado en utilidades y variables CSS |
| **Framer Motion** | Animaciones fluidas, micro-interacciones y transiciones |
| **Dnd-kit** | Lógica de arrastrar y soltar (Drag & Drop) para el tablero Kanban |
| **TanStack Query (React Query)** | Sincronización de estado asíncrono y actualizaciones optimistas |

| Backend & Core | Uso |
|---------|-----|
| **Next.js 16 (App Router)** | Framework fullstack, enrutamiento seguro y Server Actions |
| **Prisma ORM & PostgreSQL (Neon)** | Modelado de datos, migraciones y base de datos relacional serverless |
| **NextAuth.js & Firebase** | Gestión de sesiones JWT, OAuth y autenticación de credenciales |
| **Zod** | Validación estricta de esquemas y Server Actions |

---

## Estructura del proyecto

```text
checkpoint-next/
├── docs/                   # Auditoría de deuda técnica y diagramas
├── e2e/                    # Pruebas End-to-End (Playwright)
├── prisma/                 # Esquema de base de datos y migraciones
├── public/                 # Assets estáticos (SVGs, logos, placeholders)
├── src/
│   ├── actions/            # Server Actions para mutaciones seguras
│   ├── api/                # Funciones cliente para interactuar con las API Routes
│   ├── app/                # App Router de Next.js (Rutas, API, Layouts)
│   ├── components/         # Componentes UI reutilizables (GameCard, Kanban, Modals)
│   ├── hooks/              # Custom hooks (Gestión de juegos, Filtros)
│   ├── lib/                # Configuración global (Prisma, Firebase, QueryClient)
│   ├── mocks/              # Interceptores de red (MSW) para testing
│   ├── stores/             # Estado global con Zustand
│   ├── types/              # Definiciones e interfaces TypeScript
│   └── utils/              # Funciones formateadoras y constantes puras
├── setupTests.ts           # Configuración global del entorno de pruebas
└── vitest.config.ts        # Configuración del entorno de pruebas unitarias
```

---

## Descargar y ejecutar localmente

### 1. Clonar el repositorio

```
git clone [https://github.com/SaraRGonz/checkpoint-next.git](https://github.com/SaraRGonz/checkpoint-next.git)
cd checkpoint-next
```

### 2. Instalar dependencias

```
npm install
```

### 3. Configurar variables de entorno
Checkpoint requiere de varios servicios externos (RAWG, Firebase, NextAuth, OAuth). Por motivos de seguridad, los secretos **nunca** se suben al repositorio.

1. Crea un archivo `.env.local` y `.env` en la raíz del proyecto.
2. Solicita las claves de Firebase al equipo de DevOps o configura un proyecto propio en Firebase Console.
3. Obtén tu API Key gratuita de [RAWG.io](https://rawg.io/apidocs).
4. Genera una app de OAuth en GitHub para obtener el ID y el Secret.

#### Archivo .env.local (APIs y Auth):

```env
# API de Videojuegos
RAWG_API_KEY="tu_clave_rawg"

# Autenticación Segura (Genera un secreto seguro de 32+ caracteres)
NEXTAUTH_SECRET="tu_secreto_generado"

# Proveedores de OAuth (GitHub)
GITHUB_ID="tu_id_oauth_github"
GITHUB_SECRET="tu_secret_oauth_github"

# Firebase Client SDK (Seguras para el cliente, limitadas por Security Rules en Firestore)
NEXT_PUBLIC_FIREBASE_API_KEY="tu_firebase_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="tu_dominio.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="tu_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="tu_bucket.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="tu_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="tu_app_id"

# Firebase Server SDK (Privada, nunca exponer al cliente)
FIREBASE_API_KEY_SERVER="tu_firebase_api_key_AQUI_TAMBIEN"
```

#### Archivo .env (Base de Datos PostgreSQL):

```
DATABASE_URL="postgresql://usuario:password@host/neondb?sslmode=verify"
DIRECT_URL="postgresql://usuario:password@host/neondb?sslmode=require"
```

### 4. Sincronizar la Base de Datos

Ejecuta el siguiente comando para generar el cliente de Prisma y crear las tablas en tu base de datos:

```
npx prisma generate
npx prisma db push
```

### 5. Ejecutar el servidor de desarrollo

``` bash
# Entorno de desarrollo (http://localhost:3000)
npm run dev

# Ejecutar suite de pruebas unitarias y cobertura
npm run test:coverage
```

---

## Desplegar en Vercel
El proyecto incluye un script de postinstall en el package.json diseñado específicamente para garantizar la generación del cliente de Prisma en Vercel antes de la fase de compilación.

Para desplegar:

1. Inicia sesión en Vercel.

2. Haz clic en Add New... > Project e importa tu repositorio de GitHub.

3. Añade TODAS las variables de entorno de tus archivos .env y .env.local en la sección Environment Variables.
    * IMPORTANTE: En Vercel, asegúrate de que NEXTAUTH_URL apunte a tu dominio de producción (ej. https://checkpoint-teal.vercel.app).

4. Haz clic en Deploy.

--- 

## 📄 Créditos y Licencia

- Desarrollado por SaraRGonz.
- Datos e imágenes de videojuegos proporcionados por [RAWG API](https://rawg.io/apidocs).
