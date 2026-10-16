import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

export type ButtonVariant = 'primary' | 'ghost' | 'quiet' | 'lumen' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
interface Common { variant?: ButtonVariant; size?: ButtonSize; block?: boolean; icon?: IconName; iconEnd?: IconName; children?: ReactNode }

const cls = ({ variant = 'primary', size = 'md', block }: Common, extra?: string) =>
  ['btn', `btn-${variant}`, size !== 'md' ? `btn-${size}` : '', block ? 'btn-block' : '', extra || ''].filter(Boolean).join(' ');

const inner = ({ icon, iconEnd, children }: Common) => (<>{icon && <Icon name={icon} />}{children}{iconEnd && <Icon name={iconEnd} />}</>);

/** Botão do design system. Com `href` vira link; sem, é um <button type="button">. */
export function Button(props: Common & ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> | { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>)) {
  const { variant, size, block, icon, iconEnd, children, className, ...rest } = props as Common & { className?: string; href?: string } & Record<string, unknown>;
  const c = cls({ variant, size, block }, className);
  if (typeof rest.href === 'string') return <a className={c} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>{inner({ icon, iconEnd, children })}</a>;
  return <button type="button" className={c} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>{inner({ icon, iconEnd, children })}</button>;
}
