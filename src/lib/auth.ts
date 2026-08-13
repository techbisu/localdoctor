import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
const credentialsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});
export const { handlers: { GET, POST }, auth, signIn, signOut, } = NextAuth({
    adapter: PrismaAdapter(prisma as any),
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const parsed = credentialsSchema.safeParse(credentials);
                if (!parsed.success)
                    return null;
                const user = await prisma.user.findUnique({
                    where: { email: parsed.data.email },
                });
                if (!user || !user.password)
                    return null;
                const valid = await bcrypt.compare(parsed.data.password, user.password);
                if (!valid)
                    return null;
                if (user.status !== "ACTIVE")
                    return null;
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    image: user.image,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
});
