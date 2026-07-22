import clsx from 'clsx';
import { Eyebrow } from './Eyebrow';

interface SectionHeaderProps {
  eyebrow: string;
  title:   string;
  sub?:    string;
  align?:  'center' | 'left';
  /** Background the header sits on — drives text colours. */
  tone?:   'light' | 'dark';
  eyebrowVariant?: 'plain' | 'pill';
  /** Override the eyebrow's own tone (e.g. 'contrast' on a tinted band). */
  eyebrowTone?:    'light' | 'dark' | 'contrast';
  /** max-width utility for the sub paragraph. */
  subWidth?: string;
  className?: string;
}

/** Eyebrow + serif heading + optional sub — the standard section intro block. */
export function SectionHeader({
  eyebrow,
  title,
  sub,
  align = 'center',
  tone = 'light',
  eyebrowVariant = 'pill',
  eyebrowTone,
  subWidth = 'max-w-md',
  className,
}: SectionHeaderProps) {
  const dark = tone === 'dark';
  return (
    <div className={clsx(align === 'center' ? 'text-center' : 'text-left', 'mb-14', className)}>
      <Eyebrow
        variant={eyebrowVariant}
        tone={eyebrowTone ?? (dark ? 'dark' : 'light')}
        className="mb-4"
      >
        {eyebrow}
      </Eyebrow>
      <h2 className={clsx('type-heading font-bold', dark ? 'text-white' : 'text-brand-dark', sub && 'mb-4')}>
        {title}
      </h2>
      {sub && (
        <p
          className={clsx(
            'type-body',
            dark ? 'text-white/50' : 'text-gray-400',
            align === 'center' && clsx(subWidth, 'mx-auto'),
          )}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
