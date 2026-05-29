# Auditoría de deuda técnica y refactorización

A continuación se documentan los principales problemas de deuda técnica encontrados durante las fases de tipado estricto, paso de linters y cobertura de tests en el proyecto, así como las estrategias aplicadas para su resolución.

## 1. Problemas encontrados y resoluciones

### 1.1. Caracteres no escapados en JSX (Apóstrofos)
* **Problema:** Uso directo de apóstrofos (`'`) o comillas dentro del texto en componentes React, lo que ha provocado errores de parseo en el linter (`react/no-unescaped-entities`).
* **Solución:** Se resolvieron los conflictos de formato envolviendo las cadenas de texto dentro de llaves JSX (ej. `{"text"}`), lo que permite renderizar caracteres especiales de forma segura y legible sin necesidad de entidades HTML.

### 1.2. React Antipattern: Sincronización de estado en `useEffect`
* **Problema:** Uso abusivo de `useEffect` para sincronizar estados internos o derivar datos a partir de `props` (ej. `set-state-in-effect`). En React 18+ esto es un antipatrón que causa renderizados en cascada (double-renders), interfaces con "glitches" y problemas de rendimiento.
* **Solución:** 
  - **Estado derivado:** En lugar de copiar una `prop` a un estado con `useEffect`, las variables se calcularon directamente en el cuerpo del componente durante el renderizado.
  - **Manejo en eventos:** Las actualizaciones de estado se movieron a los event handlers (ej. `onClick`, `onChange`) en el momento exacto de la interacción del usuario.

### 1.3. Abuso de tipos `any` (TypeScript)
* **Problema:** En las respuestas de las APIs externas (RAWG), bases de datos (Prisma) y parámetros de componentes, se había utilizado `: any` para evadir la comprobación de TypeScript. Esto eliminaba la seguridad de tipos, causando errores en tiempo de ejecución.
* **Solución:** Se han creado interfaces estrictas (`RawgGameDetails`, `RawgSearchResult`, `Game`, `Playthrough`) y se han tipado explícitamente los mapeos de la base de datos y las respuestas `await res.json()` mediante casteo y validación.

### 1.4. Contextos personalizados innecesarios (ThemeContext)
* **Problema:** Implementación manual de un `ThemeContext` que leía de `localStorage` dentro de un `useEffect` sincrónico. Esto llegaba a generar problemas de hidratación en Next.js, como que el servidor renderizaba en modo oscuro, y el cliente parpadeaba a modo claro al montar.
* **Solución:** Se ha eliminado por completo el archivo personalizado y se ha delegado la responsabilidad a la librería `next-themes`. Esta solución está optimizada para SSR y App Router, eliminando deuda técnica y dejando la arquitectura lista para la futura implementación del modo claro, la cual podrá activarse sin este problema al estar la librería configurada y operativa.

### 1.5. Next.js 15: Asincronía en `params` y `searchParams`
* **Problema:** En Next.js 15, `params` y `searchParams` en Page Components y Route Handlers pasan a ser Promesas. Al acceder a ellos sincrónicamente o tiparlos como objetos estáticos o `any` se rompía el build y el linter.
* **Solución:** Se han actualizado las firmas de los Server Components y las API Routes para tiparlos como `Promise<{ [key: string]: string }>` y se ha aplicado `await` antes de su uso (`const { id } = await params;`).

### 1.6. Optimización de LCP (Largest Contentful Paint)
* **Problema:** Uso de etiquetas nativas `<img />` en vez del componente `<Image />` de Next.js, lo que hacía que se perdiesen las ventajas de lazy loading, optimización de formato (WebP) y prevención de CLS (Cumulative Layout Shift).
* **Solución:** Se han reemplazado por el componente `next/image` y se ha configurado `remotePatterns` en `next.config.ts` para permitir la carga segura de imágenes desde dominios externos.

### 1.7. Inestabilidad en entornos de test (Mocks y dependencias)
* **Problema:** Componentes que dependían profundamente de `useRouter`, `useSearchParams` de Next.js, o APIs del navegador como `window.matchMedia` fallaban en los tests.
* **Solución:** Se ha implementado un archivo de configuración global (`setupTests.ts`) con polyfills y *mocks* estables. También se han corregido los *mocks* dinámicos para evitar re-renderizados infinitos (como el de `URLSearchParams`).

---

## 2. Reflexión

El error más frecuente ha sido el **abuso de `any` y la sincronización de estados derivados mediante `useEffect`**. 

El uso de `any` se usó para desarrollar más rápido al principio pero hizo que se perdiese la estructura real de los datos, esto hizo que hubiese que hacer una refactorización masiva en los componentes, consumiendo mucho tiempo. Se usó tambíen mucho `useEffect` para escuchar cambios y actualizar el estado pero esto, bajo la arquitectura moderna (React 18), se ha convertido en el principal causante de errores de linting (`set-state-in-effect`) y renders innecesarios.

Para evitar acumular esta deuda técnica desde el principio implementaría las siguientes prácticas en futuros proyectos:

1. **TypeScript estricto desde el principio:** Tener una configuración de linter estricta desde el primer día, prohibiendo el uso de `any` implícitos o explícitos para garantizar la seguridad del código. También definir los modelos e interfaces de negocio (DB y APIs) antes de empezar a programar la UI, asegurando que los datos siempre estén bien estructurados.
2. **Seguir los principios de React:** Si un dato puede ser calculado a partir del estado existente o de las props, no debe ir en un `useState` ni sincronizarse con `useEffect`". 
3. **Aprovechar el ecosistema:** Antes de escribir una solución personalizada para problemas comunes como la gestión de temas o la autenticación, buscar y usar alternativas en el ecosistema estándar (como `next-themes`, `next-auth`) para apoyarse en soluciones mantenidas por la comunidad que ahorran tiempo y evitan deuda técnica innecesaria.
4. **Testing en paralelo:** No dejar la configuración de tests (Vitest, mocks) pendiente para el final de la fase de desarrollo. En vez de eso, configurar un entorno funcional de pruebas desde el primer componente y así escribir código más desacoplado y fácil de validar desde el inicio.