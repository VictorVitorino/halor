# Filme interativo "Conheça o Halor" (88 s), arquivado

Substituído pelo vídeo do pitch (`apps/web/public/media/halor-pitch.mp4`). Para voltar ao filme interativo
no protótipo, mova os três arquivos de volta para `html/`, `css/` e `js/` e troque `Pitch.init()` por
`Film.init()` em `js/99-boot.js`. No app Next o filme continua em `apps/web/components/film` e
`apps/web/lib/engines/film`: basta renderizar `<Film />` no lugar de `<PitchVideo />` em `app/page.tsx`.
