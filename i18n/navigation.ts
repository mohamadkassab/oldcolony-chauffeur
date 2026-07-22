import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Locale-aware navigation wrappers. Because routing uses `localePrefix: 'as-needed'`,
// these emit clean root URLs for the default locale (`/`, `/fleet`) and prefixed
// URLs for the others (`/fr`, `/fr/fleet`). Always use these instead of `next/link`
// and `next/navigation` for links that live inside the localized marketing site.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
