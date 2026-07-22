import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { buttonVariants, type ButtonVariant, type ButtonSize } from './buttonVariants';

type LinkProps = ComponentProps<typeof Link>;

interface ButtonLinkProps extends Omit<LinkProps, 'className'> {
  variant?:   ButtonVariant;
  size?:      ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children:   ReactNode;
}

/** A link styled exactly like <Button> — for navigation / `tel:` / anchor CTAs. */
export function ButtonLink({ variant, size, fullWidth, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonVariants({ variant, size, fullWidth, className })} {...props}>
      {children}
    </Link>
  );
}
