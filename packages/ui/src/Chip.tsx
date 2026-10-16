import type { HTMLAttributes } from 'react';
import { Icon, type IconName } from './Icon';

export type ChipTone = 'solid' | 'line' | 'ok' | 'warn';

/** Etiqueta curta (status, categoria, efeito). */
export function Chip({ tone = 'solid', icon, className = '', children, ...rest }: { tone?: ChipTone; icon?: IconName } & HTMLAttributes<HTMLSpanElement>) {
  const c = ['chip', tone !== 'solid' ? `chip-${tone}` : '', className].filter(Boolean).join(' ');
  return <span className={c} {...rest}>{icon && <Icon name={icon} />}{children}</span>;
}

/** Sobretítulo em JetBrains Mono, caixa alta e espaçamento largo. */
export function Eyebrow({ rule = true, className = '', children, ...rest }: { rule?: boolean } & HTMLAttributes<HTMLParagraphElement>) {
  return <p className={['eyebrow', rule ? '' : 'no-rule', className].filter(Boolean).join(' ')} {...rest}>{children}</p>;
}
