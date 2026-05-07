import { withAuth } from "next-auth/middleware";
import { NextResponse } from 'next/server';

export default withAuth(
    function proxy(req) {
        const response = NextResponse.next();

        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        return response;
    },
    {
        callbacks: {
            authorized: ({ req, token }) => {
                if (req.nextUrl.pathname.startsWith("/dashboard")) {
                    return token !== null;
                }
                return true;
            }
        },
        pages: {
            signIn: "/login",
        },
    }
);

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};