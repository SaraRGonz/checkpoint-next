# Tests E2E: POM y casos de uso

## Page Object Model (POM) en Playwright
Patrón de diseño que abstrae selectores del DOM y acciones en clases/objetos.
- **Por qué usarlo:** Evita duplicar selectores (`page.locator('.btn-primary')`) en 50 tests. Si la UI cambia, solo se actualiza el POM, no todos los tests. Facilita el mantenimiento a escala.

## ¿Cuándo elegir E2E frente a Integración?
Elegir E2E con Playwright solo cuando:
1. **Flujo multi-página:** Requiere navegación real (ej. Login `/login` -> Redirección a `/dashboard`).
2. **Dependencia Visual/DOM Nativo:** Comprobar si un tooltip se recorta, si el scroll funciona, o si un modal bloquea clics debajo.
3. **Critical path:** Flujos donde un fallo cuesta usuarios (Añadir juego a librería, Registrarse). 

