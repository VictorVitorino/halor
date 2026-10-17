import PitchEngine from './PitchEngine';

/* VÍDEO · Conheça o Halor (pitch narrado, 1 min 59 s).
   Pôster com o anel e o Campo Halor do próprio vídeo; o play mora dentro do anel.
   Ao tocar, ficam os controles nativos do navegador. O filme interativo anterior
   continua em components/film (arquivado): troque <PitchVideo /> por <Film /> em app/page.tsx para voltar. */
export default function PitchVideo() {
  return (
    <div className="wrap s-film-wrap" id="filme">
      <figure className="pitch" id="pitch" data-state="poster">
        <video className="pitch-video" id="pitch-video" preload="metadata" playsInline poster="/media/halor-pitch-poster.jpg" aria-label="Vídeo Conheça o Halor, 1 minuto e 59 segundos">
          <source src="/media/halor-pitch.mp4" type="video/mp4" />
        </video>
        <div className="pitch-poster">
          <button className="film-bigplay pitch-play" type="button" data-film-play="" aria-label="Assistir ao vídeo Conheça o Halor, 1 minuto e 59 segundos">
            <svg aria-hidden="true"><use href="#i-play" /></svg>
          </button>
          <p className="pitch-cap">
            <span className="pitch-k">Conheça o Halor</span>
            <span className="pitch-d mono">1 min 59 s</span>
          </p>
        </div>
      </figure>
      <PitchEngine />
    </div>
  );
}
