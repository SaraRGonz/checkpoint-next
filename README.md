![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=FFF)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

# 📝 Checkpoint
> Tu librería digital definitiva para rastrear, organizar y descubrir videojuegos.

![Checkpoint Cover](public/checkpointlogo.svg) 

Checkpoint es una plataforma web fullstack para la gestión de colecciones de videojuegos. Diseñada como un organizador personal inmersivo, permite a los usuarios buscar títulos, gestionar su estado (Wishlist, Playing, Queue, Completed, Dropped), calificar sus juegos y escribir reseñas personales bajo una interfaz de estética "Gaming".

| Despliegue | URL |
|------------|-----|
| Frontend / Backend | https://checkpoint-next-navy.vercel.app
| Repositorio | [GitHub - SaraRGonz/checkpoint-next](https://github.com/SaraRGonz/checkpoint-next) |

---

## Características Principales

- **Búsqueda Integrada con RAWG:** Escaneo de la base de datos de RAWG API con filtros por plataforma, género y año para añadir juegos rápidamente.
- **Tablero Kanban Interactivo:** Sistema *Drag and Drop* intuitivo para cambiar el estado de los juegos entre columnas (Playing, Queue, Completed, Dropped).
- **HUD Personalizado:** Panel de estadísticas de estilo "Cyberpunk" y sistema de temas semántico completo (Light Mode y Dark Mode).
- **Personalización de Librería:** Edición de metadatos del juego, sistema de puntuación por estrellas, notas enriquecidas y reposicionamiento manual de carátulas.
- **Rendimiento Optimizado:** Uso de *Server Components*, *Incremental Static Regeneration* (ISR) y un *sitemap* dinámico.

> **⚠️ Nota Técnica sobre el despliegue:** 
> En este MVP, la persistencia de datos está simulada utilizando un archivo `library.json` local. Debido a la naturaleza *Serverless* y de sistema de archivos de solo lectura (*Read-Only*) de Vercel, las operaciones de escritura (Añadir, Editar, Borrar) no persistirán en producción. Para llevar este proyecto a un entorno de producción real, este módulo de almacenamiento se sustituiría por una base de datos real como **PlanetScale, Supabase o MongoDB Atlas**.
---

## Tecnologías

| Frontend | Uso |
|----------|-----|
| **React 19** | Renderizado de UI y gestión de componentes cliente/servidor |
| **Tailwind CSS v4** | Estilizado semántico basado en utilidades y variables CSS |
| **Framer Motion** | Animaciones fluidas, micro-interacciones y transiciones |
| **Dnd-kit** | Lógica de arrastrar y soltar (Drag & Drop) para el tablero Kanban |

| Backend & Core | Uso |
|---------|-----|
| **Next.js 16 (App Router)** | Framework fullstack, enrutamiento, ISR y Server Actions |
| **TypeScript** | Tipado estricto para modelos de datos (Games) e interfaces |
| **RAWG API** | Consumo de datos externos para el catálogo de videojuegos |

---

## Estructura del proyecto

```text
checkpoint-next/
├── public/                 # Assets estáticos y placeholder de imágenes
├── src/
│   ├── actions/            # Server actions
│   ├── api/                # Endpoints internos de comunicación
│   ├── app/                # App Router de Next.js (Rutas y Páginas)
│   │   ├── api/            # API Routes
│   │   ├── game/           # Rutas dinámicas de detalles de juego
│   │   ├── library/        # Vista principal de la librería
│   │   ├── search/         # Buscador RAWG
│   │   ├── wishlist/       # Lista de deseados
│   │   └── globals.css     # Estilos globales y variables de tema
│   ├── components/         # Componentes modulares
│   │   ├── game/           # Tarjetas, modales, tablero Kanban y detalles
│   │   ├── home/           # Layout de la portada y estadísticas
│   │   ├── layout/         # Navbar adaptativo y Footer
│   │   └── ui/             # Componentes base (Botones, Modales, ActionMenus)
│   ├── context/            # Contextos de React (Theme, Library)
│   ├── data/               # Base de datos local simulada (library.json)
│   ├── hooks/              # Custom hooks (Filtros, Estado del juego)
│   ├── lib/                # Utilidades de acceso a datos y utilidades generales
│   ├── types/              # Interfaces de TypeScript
│   └── utils/              # Constantes y formateadores
├── .env.local              # Variables de entorno (ignorado en Git)
├── package.json            # Dependencias del proyecto
└── proxy.ts                # Middleware para intercepción de peticiones
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

1. Crea un archivo `.env.local` en la raíz del proyecto.
2. Solicita las claves de Firebase al equipo de DevOps o configura un proyecto propio en Firebase Console.
3. Obtén tu API Key gratuita de [RAWG.io](https://rawg.io/apidocs).
4. Genera una app de OAuth en GitHub para obtener el ID y el Secret.

Añade las siguientes variables a tu archivo:

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

### 4. Ejecutar el servidor de desarrollo

```
npm run dev
La aplicación estará disponible en http://localhost:3000
```

---

## Desplegar en Vercel
Este proyecto está optimizado para su despliegue en Vercel.

1. Inicia sesión en Vercel.

2. Haz clic en Add New... > Project e importa tu repositorio de GitHub.

3. En la sección Environment Variables, añade las claves de tu .env.local:

    - RAWG_API_KEY

    - NEXT_PUBLIC_BASE_URL (Usa la URL de producción proporcionada por Vercel).

4. Haz clic en Deploy. Vercel detectará automáticamente Next.js y ejecutará npm run build.

--- 

## 📄 Créditos y Licencia

- Datos e imágenes de videojuegos proporcionados por [RAWG API](https://rawg.io/apidocs).
