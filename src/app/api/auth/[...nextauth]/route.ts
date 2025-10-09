import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),

        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
                    {
                        method: "POST",
                        body: JSON.stringify(credentials),
                        headers: { "Content-Type": "application/json" },
                    }
                );
                if (!res.ok) return null;

                const user = await res.json();
                return user;
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (
                account?.provider === "google" ||
                account?.provider === "github"
            ) {
                await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/oauth`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: user.email,
                            name: user.name,
                            image: user.image,
                        }),
                    }
                );
                return true;
            }
            return true;
        },
        async session({ session }) {
            if (!session.user?.email) return session;

            const backendUrl =
                process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

            try {
                const res = await fetch(
                    `${backendUrl}/auth/user?email=${session.user.email}`
                );

                if (res.ok) {
                    const dbUser = await res.json();
                    session.user.id = dbUser.id;
                    session.user.hasPassword = !!dbUser.password;
                } else {
                    console.error("Backend returned:", await res.text());
                }
            } catch (err) {
                console.error("❌ Failed to load user from backend:", err);
            }

            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login", // optioneel, als je custom login page hebt
        error: "/login", // redirect bij fout
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
