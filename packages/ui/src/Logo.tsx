import type { AnchorHTMLAttributes } from 'react';
import { Mark, type MarkVariant } from './Mark';

/** Logo Halor: símbolo + palavra "halor" em Sora 600. Em fundo escuro use `variant="night"` (com brilho). */
export function Logo({ variant = 'night', href = '/', className = '', ...rest }: { variant?: MarkVariant } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const cls = ['logo', variant === 'night' ? 'logo-night' : '', className].filter(Boolean).join(' ');
  return (
    <a href={href} className={cls} aria-label="Halor, início" {...rest}>
      <Mark variant={variant} className={variant === 'night' ? 'mk-glow' : undefined} />
      <span className="wordmark">halor</span>
    </a>
  );
}
