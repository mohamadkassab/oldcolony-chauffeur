'use client';
import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, Phone, Mail, ChevronRight, Globe } from 'lucide-react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import clsx from 'clsx';
import { AccountMenu } from './AccountMenu';
import { BrandLogo } from './BrandLogo';

const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
];

interface NavbarProps {
  transparent?: boolean;
}

export function Navbar({ transparent = false }: NavbarProps) {
  const t        = useTranslations('nav');
  const locale   = useLocale();
  const pathname = usePathname();
  const router   = useRouter();

  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [langOpen,  setLangOpen]  = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the language dropdown when clicking outside it.
  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [langOpen]);

  // While the mobile menu is open: lock the page scroll behind it, and push a
  // history entry so the Android/browser back button closes the menu instead
  // of leaving the page. Closing via the X consumes that entry again.
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = 'hidden';
    window.history.pushState({ mobileMenu: true }, '');
    const onPop = () => setMenuOpen(false);
    window.addEventListener('popstate', onPop);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('popstate', onPop);
      if (window.history.state?.mobileMenu) window.history.back();
    };
  }, [menuOpen]);

  // `usePathname` from next-intl is locale-agnostic, so home is always `/`.
  const isHome          = pathname === '/';
  const showTransparent = transparent && isHome && !scrolled;

  // Shared style for the email + phone "chips" so they match exactly.
  const contactChip = clsx(
    'flex items-center gap-2 type-nav font-semibold px-4 py-2 rounded-xl border transition-all duration-200 cursor-pointer whitespace-nowrap',
    showTransparent
      ? 'border-white/30 text-white hover:bg-white/10'
      : 'border-brand-magenta text-brand-magenta hover:bg-brand-magenta hover:text-white',
  );

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    if (!isHome) {
      router.push('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 350);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const switchLocale = (code: string) => {
    setLangOpen(false);
    // Send the visitor to that locale's home. next-intl applies the right prefix:
    // `/` for the default locale, `/fr` for the other. This also keeps the shared
    // portal Navbar (English-only) safe — switching just leaves to the home.
    router.replace('/', { locale: code });
  };

  const NAV_LINKS: { label: string; action: () => void }[] = [
    { label: t('rates'),    action: () => scrollTo('rates') },
    { label: t('services'), action: () => scrollTo('services') },
    { label: t('fleet'),    action: () => scrollTo('fleet') },
    { label: t('reviews'),  action: () => scrollTo('testimonials') },
    // The blog lives on its own page now (it's no longer a homepage section).
    { label: t('blog'),     action: () => { setMenuOpen(false); router.push('/blog'); } },
  ];

  return (
    <>
      <nav className={clsx(
        'fixed w-full top-0 z-[60] transition-all duration-300',
        showTransparent ? 'nav-transparent py-5' : 'nav-scrolled py-3 bg-white',
      )}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="group cursor-pointer flex-shrink-0">
            <BrandLogo dark={showTransparent} />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button key={link.label} onClick={link.action}
                className={clsx('type-nav font-medium transition-colors duration-200 cursor-pointer',
                  showTransparent ? 'text-white/75 hover:text-white' : 'text-gray-500 hover:text-brand-magenta'
                )}>
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side: contact group · divider · language + account */}
          <div className="hidden md:flex items-center gap-3">
            {/* Contact CTA — phone only; email lives in the footer + mobile menu
                so it doesn't crowd the header. */}
            <a href="tel:+17812345451" className={contactChip}>
              <Phone size={13} className="flex-shrink-0" />
              <span>{t('phone')}</span>
            </a>

            {/* Divider */}
            <span className={clsx('h-5 w-px flex-shrink-0', showTransparent ? 'bg-white/25' : 'bg-gray-200')} />

            {/* Language switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(v => !v)}
                className={clsx('flex items-center gap-1.5 type-nav font-medium transition-colors cursor-pointer',
                  showTransparent ? 'text-white/75 hover:text-white' : 'text-gray-500 hover:text-brand-magenta'
                )}
              >
                <Globe size={14} />
                <span className="uppercase">{locale}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-8 bg-white border border-brand-border rounded-xl py-1 w-36 z-10">
                  {LOCALES.map(l => (
                    <button key={l.code} onClick={() => switchLocale(l.code)}
                      className={clsx('w-full text-left px-4 py-2 type-body-sm hover:bg-brand-light transition-colors cursor-pointer',
                        l.code === locale ? 'text-brand-magenta font-semibold' : 'text-gray-700'
                      )}>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Account */}
            <AccountMenu transparent={showTransparent} />
          </div>

          {/* Mobile burger */}
          <button
            className={clsx('lg:hidden p-1 transition-colors cursor-pointer', showTransparent ? 'text-white' : 'text-gray-800')}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <div className={clsx(
        'fixed inset-0 z-[100] flex flex-col bg-white transition-all duration-300',
        menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
          <Link href="/" className="cursor-pointer">
            <BrandLogo />
          </Link>
          <button onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-gray-900 p-1 cursor-pointer">
            <X size={22} />
          </button>
        </div>

        {/* Scrollable middle — centres when it fits, scrolls when it doesn't,
            and never collides with the pinned contact footer below. */}
        <div className="flex-1 min-h-0 overflow-y-auto px-8">
          <div className="min-h-full flex flex-col justify-center gap-1 py-6">
            {NAV_LINKS.map((link) => (
              <button key={link.label} onClick={link.action}
                className="flex items-center justify-between py-4 border-b border-brand-border text-gray-900 text-lg font-medium hover:text-brand-magenta transition-colors group w-full text-left cursor-pointer">
                {link.label}
                <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-magenta transition-colors" />
              </button>
            ))}

            {/* Account (mobile) */}
            <AccountMenu variant="mobile" onNavigate={() => setMenuOpen(false)} />

            {/* Language switcher mobile */}
            <div className="py-4 border-b border-brand-border">
              <p className="type-badge font-medium text-gray-400 mb-3">Language</p>
              <div className="flex gap-3">
                {LOCALES.map(l => (
                  <button key={l.code} onClick={() => { switchLocale(l.code); setMenuOpen(false); }}
                    className={clsx('px-3 py-1.5 rounded-lg type-body-sm font-medium transition-colors cursor-pointer',
                      l.code === locale ? 'bg-brand-magenta text-white' : 'bg-brand-light text-gray-700 hover:bg-brand-border'
                    )}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-brand-light border-t border-brand-border space-y-3 flex-shrink-0">
          <a href="tel:+17812345451" className="flex items-center gap-2 text-brand-magenta type-body font-semibold cursor-pointer">
            <Phone size={18} />
            (781) 234-5451
          </a>
          <a href="mailto:info@oldcolonychauffeur.com" className="flex items-center gap-2 text-gray-600 type-body-sm cursor-pointer hover:text-brand-magenta transition-colors">
            <Mail size={16} />
            info@oldcolonychauffeur.com
          </a>

          {/* Sign out — always the last action in the menu */}
          <AccountMenu variant="mobile" mobileSection="signout" />
        </div>
      </div>
    </>
  );
}
