import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";

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
                    const API_KEY = process.env.FIREBASE_API_KEY_SERVER || process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
                    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
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
                        throw new Error(data?.error?.message || "UNKNOWN_ERROR");
                    }
                    
                    await db.user.upsert({
                        where: { id: data.localId },
                        update: {},
                        create: {
                            id: data.localId,
                            email: data.email,
                            name: data.email.split('@')[0],
                            image: "/placeholder.jpg",
                            imagePosition: "50% 50%"
                        }
                    });

                    return { id: data.localId, email: data.email, name: data.email.split('@')[0] };
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
        async signIn({ user, account }) {
            if (account?.provider === "github" && user?.id) {
                await db.user.upsert({
                    where: { id: user.id },
                    update: {
                        name: user.name || undefined,
                        image: user.image || undefined,
                        email: user.email || undefined
                    },
                    create: {
                        id: user.id,
                        name: user.name || "Runner",
                        email: user.email,
                        image: user.image || "/placeholder.jpg",
                        imagePosition: "50% 50%"
                    }
                });
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                const dbUser = await db.user.findUnique({ where: { id: user.id } });
                token.imagePosition = dbUser?.imagePosition || "50% 50%";
            }
            if (trigger === "update" && session) {
                token.name = session.user.name;
                token.picture = session.user.image;
                token.imagePosition = session.user.imagePosition;

                if (token.id) {
                    await db.user.update({
                        where: { id: token.id as string },
                        data: {
                            name: token.name,
                            image: token.picture,
                            imagePosition: token.imagePosition as string
                        }
                    });
                }
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