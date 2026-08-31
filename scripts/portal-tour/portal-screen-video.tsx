import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Tour gravado do Portal de Benefícios em produção
 * (servicos.baita.testbeds.rnp.br), emoldurado em uma janela de navegador.
 *
 * É uma gravação em vez de uma réplica porque ela *é* o produto: o catálogo,
 * os textos e as fotos são reais, e os estados de hover e as transições de
 * rota do portal vêm junto. Uma réplica feita à mão se afastaria do produto
 * e exigiria conteúdo inventado para preencher os cards.
 *
 * Grave novamente com scripts/record-portal-tour.mjs sempre que o portal
 * mudar — ele é um testbed, então o catálogo também mudará.
 */

/**
 * H.264 em MP4, não WebM. WebM/VP8 é o formato emitido pelo gravador e
 * funciona no Chrome e no WebKit do Playwright — mas o WebKit do Playwright
 * não é o Safari e tem sua própria pilha de mídia; portanto, isso nunca foi
 * evidência sobre o Safari. Em um Safari real, o arquivo nem carregou: sem
 * autoplay, o botão de reprodução também não fazia nada. H.264 é o único
 * codec de vídeo que todos os navegadores decodificam. Além disso, aqui ele
 * ocupa metade do tamanho.
 */
const TOUR = "/media/portal-tour-pt.mp4";
/** Primeiro quadro da mesma gravação, para que a imagem estática e o vídeo
 *  nunca mostrem enquadramentos diferentes. */
const POSTER = "/media/portal-tour-pt.jpg";

export function PortalScreen({
  variant,
}: {
  variant: "column" | "inline";
}) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // A seção fica várias telas abaixo e a gravação tem ~1,9 MB. Nada é
  // carregado até que o visitante esteja a caminho dela — enquanto isso,
  // o poster exibe o quadro correspondente.
  const [isNear, setIsNear] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsNear(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsNear(true);
        observer.disconnect();
      },
      // Perto o suficiente para ser o próximo elemento na tela, mas longe o
      // bastante para que o visitante raramente chegue ao poster primeiro.
      { rootMargin: "300px" }
    );

    // Aguarda dois quadros antes de observar: o ScrollTrigger insere os
    // espaçadores da fixação em seu próprio ciclo e, até isso acontecer, a
    // página é curta o suficiente para este elemento ficar logo abaixo da
    // dobra. Observar imediatamente usava esse layout transitório e baixava
    // a gravação para visitantes ainda no topo da página.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => observer.observe(element));
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  // Reproduz sempre, inclusive com prefers-reduced-motion. Essa é uma
  // exceção deliberada ao restante da página, que respeita a preferência em
  // todos os lugares: este painel é a demonstração do produto e foi pensado
  // para repetir sozinho; aqui, um quadro pausado parece quebrado, não calmo.
  // O controle de pausa abaixo oferece a saída.
  //
  // Autoplay ainda é apenas uma solicitação — o Safari o recusa no Modo de
  // Pouca Energia —, então todo caminho que termina pausado mostra o botão de
  // reprodução.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isNear) return;

    // Definir src depois da montagem não reativa o atributo de autoplay de
    // forma confiável; por isso, solicita a reprodução explicitamente assim
    // que a fonte estiver pronta.
    video.play().catch(() => {});

    // Se o navegador recusou, o primeiro toque ou clique em qualquer lugar
    // conta como o gesto que ele estava aguardando.
    const retry = () => {
      if (video.paused) video.play().catch(() => {});
    };
    document.addEventListener("pointerdown", retry, { once: true });
    return () => document.removeEventListener("pointerdown", retry);
  }, [isNear]);

  // Vinculado imperativamente em vez de usar as props onPlaying/onPause do
  // React: elas não dispararam aqui — os eventos nativos disparam, então o
  // botão permanecia sobre um vídeo que já estava sendo reproduzido.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const sync = () => setIsPlaying(!video.paused);
    const events = ["play", "playing", "pause", "ended", "emptied"];
    events.forEach((name) => video.addEventListener(name, sync));
    sync();

    return () => events.forEach((name) => video.removeEventListener(name, sync));
  }, []);

  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }, []);

  return (
    <div ref={ref} className="t-screen-slot" data-variant={variant}>
      <figure className="t-screen-frame m-0">
        {/* A moldura da janela é marcação, não parte da gravação: a captura é
            apenas a área visível, e desenhar a moldura aqui a mantém nítida
            e permite seguir os raios da própria página. */}
        <div className="t-screen-bar" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="t-screen-stage">
          <video
            ref={videoRef}
            className="t-screen-video"
            // Se algum destes atributos faltar, o iOS abre em tela cheia ou
            // recusa o início: muted + playsInline tornam o autoplay válido.
            autoPlay
            muted
            loop
            playsInline
            // Não usar "none": o Safari interpreta isso literalmente e nunca
            // inicia o autoplay. O carregamento tardio é controlado pelo src,
            // não pelo preload.
            preload="auto"
            poster={POSTER}
            aria-label={t("portalDemo.alt")}
            src={isNear ? TOUR : undefined}
          />

          <button
            type="button"
            onClick={toggle}
            className="t-screen-play"
            data-playing={String(isPlaying)}
            aria-label={t(isPlaying ? "portalDemo.pause" : "portalDemo.play")}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-current" aria-hidden="true" />
            ) : (
              <Play className="h-5 w-5 fill-current" aria-hidden="true" />
            )}
          </button>
        </div>
      </figure>
    </div>
  );
}
