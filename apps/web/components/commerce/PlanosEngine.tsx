'use client';
import { useEngine } from '@/lib/hooks/useEngine';
import { bootPlanos } from '@/lib/engines/commerce/site';

/* Motor da seção de planos do site (v-site): cartões, pacotes empresariais, ciclo e o caminho até o checkout.
   Fica separado do SiteEngine; o Campo Halor da tela continua com ele. */
export default function PlanosEngine() {
  useEngine('v-site', bootPlanos);
  return null;
}
