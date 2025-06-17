import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

// Create a separate Prisma client for NextAuth without extensions
const prismaAuth = new PrismaClient()

const authOptions = {
  adapter: PrismaAdapter(prismaAuth),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log("Tentative de connexion avec:", credentials?.email)
          
          if (!credentials?.email || !credentials?.password) {
            console.log("Email ou mot de passe manquant")
            throw new Error('Email et mot de passe requis')
          }

          const user = await prismaAuth.user.findUnique({
            where: {
              email: credentials.email as string
            }
          })

          if (!user) {
            console.log("Utilisateur non trouvé")
            throw new Error('Email non trouvé')
          }

          if (!user.password) {
            console.log("Utilisateur sans mot de passe")
            throw new Error('Compte invalide')
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isCorrectPassword) {
            console.log("Mot de passe incorrect")
            throw new Error('Mot de passe incorrect')
          }

          console.log("Connexion réussie pour:", user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error("Erreur d'authentification:", error)
          throw error
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }