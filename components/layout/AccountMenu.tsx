'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User, Users, ChevronDown, LogOut, Car, Settings, LayoutDashboard, Newspaper } from 'lucide-react';
import clsx from 'clsx';

interface AccountMenuProps {
  transparent?: boolean;
  variant?: 'desktop' | 'mobile';
  /** Mobile only: 'links' renders the nav rows, 'signout' just the sign-out row —
      the menu places sign-out last, after language and contact. */
  mobileSection?: 'links' | 'signout';
  onNavigate?: () => void;
}

export function AccountMenu({ transparent = false, variant = 'desktop', mobileSection = 'links', onNavigate }: AccountMenuProps) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside it.
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const isAuthed = status === 'authenticated' && !!session?.user;
  const isAdmin  = isAuthed && (session!.user.role as string) === 'ADMIN';
  const firstName = session?.user?.name?.split(' ')[0] ?? 'Account';

  // Items shown when signed in.
  const items = isAdmin
    ? [
        { href: '/admin', label: 'Bookings', icon: LayoutDashboard },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/blog', label: 'Manage Blog', icon: Newspaper },
      ]
    : [
        { href: '/account/rides', label: 'My Rides', icon: Car },
        { href: '/account', label: 'Account settings', icon: Settings },
      ];

  /* ---------------- Mobile (stacked rows inside the full-screen menu) -------- */
  if (variant === 'mobile') {
    if (mobileSection === 'signout') {
      if (!isAuthed) return null;
      return (
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2 text-gray-600 type-body-sm font-medium hover:text-brand-magenta transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          Sign out
        </button>
      );
    }
    if (!isAuthed) {
      return (
        <Link
          href="/login"
          onClick={onNavigate}
          className="flex items-center justify-between py-4 border-b border-brand-border text-gray-900 text-lg font-medium hover:text-brand-magenta transition-colors"
        >
          Sign In
          <User size={18} className="text-gray-300" />
        </Link>
      );
    }
    return (
      <>
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className="flex items-center justify-between py-4 border-b border-brand-border text-gray-900 text-lg font-medium hover:text-brand-magenta transition-colors"
          >
            {label}
            <Icon size={18} className="text-gray-300" />
          </Link>
        ))}
      </>
    );
  }

  /* ---------------- Desktop ------------------------------------------------- */
  if (!isAuthed) {
    return (
      <Link
        href="/login"
        className={clsx(
          'flex items-center gap-2 type-nav font-semibold px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap',
          transparent
            ? 'bg-white text-brand-magenta hover:bg-white/90'
            : 'bg-brand-magenta text-white hover:bg-brand-pink',
        )}
      >
        <User size={13} className="flex-shrink-0" />
        <span>Sign In</span>
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          'flex items-center gap-2 type-nav font-semibold transition-colors cursor-pointer whitespace-nowrap',
          transparent ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-brand-magenta',
        )}
      >
        {session!.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session!.user.image}
            alt=""
            className="w-7 h-7 rounded-full object-cover border border-brand-border"
          />
        ) : (
          <span className="w-7 h-7 rounded-full bg-brand-magenta text-white flex items-center justify-center text-xs font-bold">
            {firstName.charAt(0).toUpperCase()}
          </span>
        )}
        <span>{firstName}</span>
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="absolute right-0 top-12 bg-white border border-brand-border rounded-xl p-1.5 w-56 z-[70] shadow-lg">
          {items.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 type-body-sm text-gray-700 hover:bg-brand-light hover:text-brand-magenta transition-colors"
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
          <div className="my-1 mx-1 border-t border-brand-border" />
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 type-body-sm text-gray-700 hover:bg-brand-light hover:text-brand-magenta transition-colors cursor-pointer"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
