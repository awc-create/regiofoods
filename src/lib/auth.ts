// src/lib/auth.ts
// Same credentials setup as Essentia: email + password, JWT sessions, admin role.
import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  providers: [
    Credentials({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(creds) {
        const email = creds?.email?.toLowerCase?.().trim();
        const password = creds?.password;
        if (!email || !password) return null;

        let user;
        try {
          user = await prisma.user.findUnique({ where: { email } });
        } catch (err) {
          console.error('[auth] database error during sign-in:', err);
          throw new Error('DatabaseUnavailable');
        }
        if (!user?.passwordHash) {
          console.warn(
            `[auth] sign-in failed for ${email}: ${user ? 'account has no password' : 'no such account'}`
          );
          return null;
        }

        const ok = await compare(password, user.passwordHash);
        if (!ok) {
          console.warn(`[auth] sign-in failed for ${email}: wrong password`);
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
          role: user.role === 'admin' ? 'admin' : 'user',
        };
      },
    }),
  ],
  pages: { signIn: '/auth/signin' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role ?? 'user';
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role ?? 'user';
      session.user.id = token.sub;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
