'use client';
import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { BrandLogo } from './BrandLogo';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { WHATSAPP_URL } from '@/lib/contact';

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export function Footer() {
  const t      = useTranslations('footer');
  const tnav   = useTranslations('nav');
  return (
    <footer className="bg-brand-dark text-white">
      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="mb-5">
              <BrandLogo dark />
            </div>
            <p className="type-body-sm font-light text-white/40 leading-7">{t('tagline')}</p>
          </div>

          {/* Navigate */}
          <div>
            <h4 className="type-badge font-semibold text-brand-magenta mb-5">{t('navigate')}</h4>
            <ul className="space-y-3">
              {(['services', 'testimonials'] as const).map(id => (
                <li key={id}>
                  <button onClick={() => scrollTo(id)} className="type-body-sm font-light text-white/40 hover:text-white transition-colors">
                    {tnav(id === 'services' ? 'services' : 'reviews')}
                  </button>
                </li>
              ))}
              <li><button onClick={() => scrollTo('fleet')} className="type-body-sm font-light text-white/40 hover:text-white transition-colors cursor-pointer">{tnav('fleet')}</button></li>
              <li>
                <Link
                  href={{ pathname: '/services/[slug]', params: { slug: 'corporate-travel' } }}
                  className="type-body-sm font-light text-white/40 hover:text-white transition-colors"
                >
                  {t('corporate')}
                </Link>
              </li>
              <li><Link href="/blog" className="type-body-sm font-light text-white/40 hover:text-white transition-colors">{tnav('blog')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="type-badge font-semibold text-brand-magenta mb-5">{t('contact')}</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 type-body-sm font-light text-white/40">
                <MapPin size={15} className="text-brand-magenta mt-0.5 flex-shrink-0" />
                <span>{t('address')}</span>
              </li>
              <li className="flex gap-3 type-body-sm font-light text-white/40">
                <Phone size={15} className="text-brand-magenta mt-0.5 flex-shrink-0" />
                <a href="tel:+17812345451" className="hover:text-white transition-colors">+1 (781) 234-5451</a>
              </li>
              <li className="flex gap-3 type-body-sm font-light text-white/40">
                <Mail size={15} className="text-brand-magenta mt-0.5 flex-shrink-0" />
                <a href="mailto:info@oldcolonychauffeur.com" className="hover:text-white transition-colors">info@oldcolonychauffeur.com</a>
              </li>
              <li className="flex gap-3 type-body-sm font-light text-white/40">
                <WhatsAppIcon size={15} className="text-brand-magenta mt-0.5 flex-shrink-0" />
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
              </li>
            </ul>
          </div>

          {/* Service Area */}
          <div>
            <h4 className="type-badge font-semibold text-brand-magenta mb-5">{t('serviceArea')}</h4>
            <p className="type-body-sm font-light text-white/40 leading-7">
              Canton · Dedham · Westwood · Norwood · Milton · Sharon · Stoughton · Walpole · Needham · Quincy
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center type-caption text-white/30 gap-4">
          <p>© {new Date().getFullYear()} Old Colony Chauffeur. {t('rights')}</p>
          <div className="flex gap-6">
            <button className="hover:text-white/60 transition-colors">{t('privacy')}</button>
            <button className="hover:text-white/60 transition-colors">{t('terms')}</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
