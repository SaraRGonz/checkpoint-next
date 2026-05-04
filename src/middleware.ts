import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // CABECERAS DE SEGURIDAD HTTP 
    
    response.headers.set('X-Frame-Options', 'DENY');
    
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    return response;
}

export const config = {
    matcher: [
        /*
         * aplica a todas las rutas EXCEPTO a:
         * - _next/static archivos estáticos de Next
         * - _next/image optimización de imágenes
         * - favicon.ico
         * - cualquier archivo con extensión .svg, .png, .jpg, etc.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};