import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import enMessages from '@/messages/en.json';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Old Colony Chauffeur — Portal',
  robots: { index: false, follow: false },
};

// English-only portal (login, admin, client account). Separate <html> root from
// the public [locale] site, which has its own layout. We provide the same
// Session + Intl context the marketing site uses so the shared <Navbar> works
// here too. Passing the server session up front avoids any signed-in/out flash.
export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-brand-fog text-brand-dark">
        <SessionProvider session={session}>
          <NextIntlClientProvider locale="en" messages={enMessages}>
            {children}
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
