import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                
                try {
                    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                            returnSecureToken: true,
                        }),
                    });
                    
                    const data = await res.json();
                    
                    if (!res.ok) {
                        const errorMessage = data?.error?.message || "UNKNOWN_ERROR";
                        throw new Error(errorMessage);
                    }
                    
                    return { id: data.localId, email: data.email };
                } catch (error: any) {
                    throw new Error(error.message);
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
            }
            if (trigger === "update" && session) {
                token.name = session.user.name;
                token.picture = session.user.image;
                token.imagePosition = session.user.imagePosition;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string;
                session.user.imagePosition = token.imagePosition as string | null;
                if (token.name) session.user.name = token.name;
                if (token.picture) session.user.image = token.picture as string;
            }
            return session;
        }
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };