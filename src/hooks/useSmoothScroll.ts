import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

/**
 * Adiciona suavização inercial à página inteira.
 *
 * ScrollSmoother funciona traduzindo `#smooth-content` dentro de um
 * `#smooth-wrapper` de altura fixa, então tudo que precisa permanecer no
 * lugar — o cabeçalho e o aviso de consentimento — deve ficar FORA do wrapper.
 * Um elemento com `position: fixed` dentro dele usa o ancestral transformado
 * como referência e rola junto com a página.
 *
 * É totalmente desabilitada com prefers-reduced-motion: a suavização separa
 * a página do dispositivo de entrada, exatamente o que essa configuração
 * pede que não façamos. O toque permanece nativo pelo mesmo motivo.
 */
export function useSmoothScroll() {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1,
        // Serve como fallback para rolagens programáticas que não geram
        // eventos de entrada; o caminho normal agenda o snap logo após o
        // último gesto, sem esperar o smoother terminar.
        onStop: () =>
          window.dispatchEvent(new Event("baita:smooth-scroll-stop")),
        // Apenas dispositivos com ponteiro. No toque, o sistema operacional
        // já controla a rolagem, e sobrescrevê-la parece um erro.
        smoothTouch: 0,
        // Mantém as seções fixadas alinhadas à posição suavizada, em vez da
        // posição bruta.
        ignoreMobileResize: true,
      });

      return () => smoother.kill();
    });

    return () => mm.revert();
  }, []);
}
