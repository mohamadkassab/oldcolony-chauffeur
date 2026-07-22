import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';

const adminEmails = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function isAdminEmail(email?: string | null) {
  return !!email && adminEmails.includes(email.toLowerCase());
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' },
  trustHost: true,
  pages: { signIn: '/login' },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    // Database session strategy: `user` is the DB record. The allowlist is the
    // source of truth for who is an admin.
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = isAdminEmail(user.email) ? Role.ADMIN : Role.CLIENT;
      }
      return session;
    },
  },
  events: {
    // Keep the DB role in sync with the allowlist so server-side authorization
    // that reads the DB agrees with the session.
    async signIn({ user }) {
      if (user.id && isAdminEmail(user.email)) {
        await prisma.user
          .update({ where: { id: user.id }, data: { role: Role.ADMIN } })
          .catch(() => {});
      }
    },
  },
});
