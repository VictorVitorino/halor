import type { SVGProps } from 'react';

export type MarkVariant = 'night' | 'paper' | 'mono';
const REF: Record<MarkVariant, string> = { night: '#hl-mark', paper: '#hl-mark-paper', mono: '#hl-mark-mono' };

/** Símbolo Halor: halo aberto (atenção), anel (confiança), núcleo aceso (valor) e faísca (o primeiro olhar). */
export function Mark({ variant = 'night', label, ...rest }: { variant?: MarkVariant; label?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden={label ? undefined : true} role={label ? 'img' : undefined} aria-label={label} {...rest}>
      <use href={REF[variant]} />
    </svg>
  );
}
