import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile }) {
      const email = user.email;
      const existingUser = await prisma.user.findUnique({ where: { email } });
  
      if (existingUser && existingUser.provider !== account.provider) {
        // Vincule a conta atual ao usuário existente
        await prisma.account.create({
          data: {
            userId: existingUser.id,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            type: "user"
            // Outros dados necessários
          },
        });
      }

      return true;
    },
    async jwt({ token }) {

      const user = await prisma.user.findUnique({
        where: {
          id: token.sub
        }
      })

      if (user) {
        token.role = user.role
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session) {
        session.user = {
          ...session.user,
          role: token.role,
          id: token.sub || "" // Adiciona o Id do user a sessão
        } as any
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};