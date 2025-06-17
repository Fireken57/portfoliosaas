import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email et mot de passe requis')
          }
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          })
          if (!user) {
            throw new Error('Email non trouvé')
          }
          if (!user.password) {
            throw new Error('Compte invalide')
          }
          const isCorrectPassword = await bcrypt.compare(
            credentials.password as string,
            user.password
          )
          if (!isCorrectPassword) {
            throw new Error('Mot de passe incorrect')
          }
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          throw error
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    }
  }
} 