import type { SVGProps } from 'react';
import type { IconName } from './icons';

export type { IconName };

/** Ícone de linha do sprite Halor. Decorativo por padrão; passe `label` quando o ícone carregar sentido sozinho. */
export function Icon({ name, label, ...rest }: { name: IconName; label?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden={label ? undefined : true} role={label ? 'img' : undefined} aria-label={label} {...rest}>
      <use href={`#i-${name}`} />
    </svg>
  );
}
