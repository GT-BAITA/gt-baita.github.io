import { useCallback, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { onContactRequest } from "@/lib/contact-request";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/**
 * Fixa uma seção com ScrollTrigger e transforma o progresso da rolagem em um
 * índice ativo discreto, para que uma viewport fixa percorra N itens.
 *
 * Substitui uma combinação feita à mão de `position: sticky` e listener de
 * rolagem. A fixação precisa vir do ScrollTrigger, e não do CSS, porque o
 * ScrollSmoother coloca a página dentro de um wrapper transformado; o sticky
 * nativo usa esse wrapper como referência — e ele nunca rola —, então para de
 * fixar silenciosamente.
 *
 * O progresso é escrito no DOM como uma propriedade customizada, em vez de
 * state: renderizar no React a cada quadro de rolagem para mover um elemento
 * seria trabalho desperdiçado.
 */

/** Faixa de tolerância em torno de cada limite, como fração da zona de um item. */
const HYSTERESIS = 0.06;

/** Limite de tempo em que um salto iniciado por clique suprime atualizações. */
const JUMP_TIMEOUT = 1500;

/**
 * Tempo de silêncio depois que o leitor para de rolar antes de a seção se
 * acomodar no item mais próximo.
 *
 * Contado a partir do momento em que a posição de rolagem *nativa* fica
 * quieta, não a partir das atualizações do ScrollTrigger. O ScrollSmoother
 * continua suavizando a página depois que a roda para, mas o snap já pode
 * apontar para a âncora nesse momento; esperar o smoother terminar deixaria
 * uma espera perceptível antes de iniciar a transição.
 */
const SETTLE_DELAY = 60;

/**
 * Trackpads emitem uma sequência de deltas pequenos durante o mesmo gesto.
 * Mantê-los agrupados por este intervalo evita que cada evento avance um card.
 */
const TRACKPAD_SETTLE_DELAY = 120;

/** Deltas em pixels abaixo deste valor são tratados como gesto de trackpad. */
const TRACKPAD_DELTA_LIMIT = 50;

/** Silêncio necessário para que o próximo gesto de trackpad seja novo. */
const TRACKPAD_GESTURE_TIMEOUT = 260;

/** Perto o suficiente de um ponto de repouso para que o ajuste não seja visível. */
const SETTLE_EPSILON = 0.012;

/**
 * Quão para trás, dentro do item de origem, o leitor precisa estar — como
 * fração do intervalo — para voltar a ele em vez de continuar.
 *
 * Um quarto, contra os três quartos reservados para continuar, para que os
 * dois lados sejam deliberadamente desiguais: rolar para baixo deve significar
 * o próximo item, e não uma disputa com o item anterior. Na metade exata — o
 * simples "nearest" — uma roda de clique nunca venceria, pois um passo move
 * muito menos que metade de um intervalo.
 *
 * O valor passou de 0,12 para 0,25 porque um oitavo de intervalo representa
 * apenas cerca de 140px de rolagem aqui; assim, dois passos ao entrar na seção
 * levavam o leitor diretamente além do primeiro card.
 */
const RETURN_TOLERANCE = 0.25;

/**
 * Quanto tempo a entrada precisa ficar parada antes de uma posição pequena e
 * indecisa ser ajustada mesmo assim.
 *
 * Um gesto decisivo é tratado em SETTLE_DELAY e nunca espera por este valor.
 * Isto serve para a entrada oposta: uma roda de clique, cujos passos movem
 * uma fração do intervalo e chegam separados por algumas centenas de ms.
 * Ajustar entre esses passos desfaz cada um deles e torna a seção impossível
 * de percorrer; por isso, enquanto a entrada continua chegando, pequenos
 * deslocamentos são deixados acumular. O intervalo curto mantém essa proteção
 * sem deixar o snap parado por tempo demais depois do último passo.
 */
const INPUT_SETTLED = 250;

/**
 * Duração do deslizamento apenas para o caminho alternativo. Com o
 * ScrollSmoother presente — como ocorre em toda página real daqui —, o
 * smoother controla a curva; medido dessa forma, a soltura percorre 0,18 →
 * 0,24 → 0,10 → 0,03 → 0,006 de progresso a cada 200ms: um pico seguido de
 * uma redução constante até a âncora, que era a parada por inércia desejada.
 */
const SETTLE_DURATION = 0.3;

/**
 * Apenas o caminho alternativo, como acima. Somente desaceleração, sem
 * ease-in. Medido a cada 100ms de progresso após a soltura: power2.inOut
 * percorreu 0,070 → 0,0005 → 0,003 → 0,013; ou seja, parou completamente por
 * um quinto de segundo antes de retomar, porque um ease-in começa com
 * velocidade zero enquanto a página ainda se move. sine.inOut parou da mesma
 * forma. power2.out percorre 0,065 → 0,033 → 0,017 → 0,009 → 0, assumindo o
 * controle quase na velocidade que a rolagem já tinha e desacelerando daí —
 * exatamente a sensação de "continuar deslizando até a próxima âncora". O
 * final suave é o ease-out.
 */
const SETTLE_EASE = "power2.out";

/** Limite de tempo em que um ajuste impede o agendamento de outro. */
const SETTLE_TIMEOUT = 1100;

export function useScrollPin(
  count: number,
  {
    viewportsPerItem = 1,
    minWidth = 1024,
    buildTimeline,
    deriveIndex,
    progressForIndex,
  }: {
    viewportsPerItem?: number;
    minWidth?: number;
    /**
     * Cria a animação com scrub. A timeline tem `count` unidades — uma por
     * item —, então o tempo da timeline e o cálculo do índice abaixo usam a
     * mesma escala. Coloque cada transição dentro de uma unidade e deixe o
     * restante como permanência.
     */
    buildTimeline?: (tl: gsap.core.Timeline, root: HTMLElement) => void;
    /**
     * Lê o índice ativo do estado com scrub, em vez do progresso bruto. Com
     * uma timeline agendada livremente, os dois se afastariam e os rótulos
     * mudariam enquanto a geometria ainda estivesse no meio da transição.
     */
    deriveIndex?: (root: HTMLElement) => number;
    /**
     * Progresso (0..1) para o qual um clique em `index` deve rolar. O padrão é
     * o meio de uma divisão uniforme, correto apenas quando os itens estão
     * distribuídos igualmente pela timeline.
     */
    progressForIndex?: (index: number) => number;
  } = {}
) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLElement | null>(null);

  const activeRef = useRef(0);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  // Definido enquanto um clique anima a rolagem até um item-alvo. Sem ele,
  // onUpdate continua calculando o índice no caminho, então saltar de 01 para
  // 04 exibe rapidamente 02 e 03.
  const jumpRef = useRef<{ index: number; expires: number } | null>(null);

  // Progresso mais recente da rolagem, além do ajuste pendente. Refs em vez de
  // state: mudam a cada quadro e não acionam renderizações.
  const progressValueRef = useRef(0);
  const settleTimerRef = useRef<number | null>(null);
  const isSettlingRef = useRef(false);
  // Mantém a apresentação atual enquanto um CTA conduz o leitor ao formulário
  // através de uma seção fixada. O movimento continua, mas os painéis
  // intermediários não abrem durante a passagem.
  const suppressUpdatesRef = useRef(false);
  /** Direção do leitor e posição no quadro anterior. */
  const directionRef = useRef(1);
  const lastScrollRef = useRef(0);
  const directionLockUntilRef = useRef(0);
  const inputKindRef = useRef<"wheel" | "trackpad" | "keyboard" | null>(null);
  const trackpadGestureRef = useRef<{
    direction: number;
    lastInputAt: number;
    handled: boolean;
  } | null>(null);
  const settleTweenRef = useRef<gsap.core.Tween | null>(null);
  /** Momento em que o leitor interagiu por último com roda, tela ou teclado. */
  const lastInputAtRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isEnabled, setIsEnabled] = useState(false);

  // Lido dentro do efeito em vez de listado como dependência: o efeito cria e
  // fixa um ScrollTrigger, e executá-lo novamente por uma mudança de identidade
  // do callback desmontaria a fixação no meio da rolagem.
  const progressForIndexRef = useRef(progressForIndex);
  progressForIndexRef.current = progressForIndex;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        pinned: `(min-width: ${minWidth}px) and (prefers-reduced-motion: no-preference)`,
      },
      (context) => {
        if (!context.conditions?.pinned) return;

        setIsEnabled(true);
        // A página pode montar já em uma posição restaurada pelo navegador;
        // comparar o primeiro evento com zero inventaria uma direção.
        lastScrollRef.current = window.scrollY;

        // Uma seção fixada para a página: a rolagem continua recebendo entrada
        // enquanto nada se traduz, o que parece um travamento. Aplicar scrub à
        // geometria pelo progresso da rolagem devolve movimento proporcional à
        // entrada para cada pixel.
        const tl = buildTimeline
          ? gsap.timeline({ paused: true })
          : null;
        if (tl && buildTimeline) buildTimeline(tl, pin);

        // Onde cada item fica totalmente aberto — as mesmas posições para as
        // quais um clique rola. Compartilhá-las é o objetivo: ao soltar no
        // meio de uma transição, a rolagem se ajusta exatamente onde o clique
        // naquele item chegaria.
        const resolve = progressForIndexRef.current;
        const restPoints = Array.from({ length: count }, (_, i) =>
          resolve ? resolve(i) : (i + 0.5) / count
        ).sort((a, b) => a - b);
        const firstRest = restPoints[0];
        const lastRest = restPoints[restPoints.length - 1];

        const clearSettle = () => {
          if (settleTimerRef.current === null) return;
          window.clearTimeout(settleTimerRef.current);
          settleTimerRef.current = null;
        };

        const suppressUpdatesUntilLeave = () => {
          suppressUpdatesRef.current = true;
          jumpRef.current = null;
          inputKindRef.current = null;
          trackpadGestureRef.current = null;
          clearSettle();
          settleTweenRef.current?.kill();
          settleTweenRef.current = null;
          isSettlingRef.current = false;
        };

        const unsubscribeContactRequest = onContactRequest(
          suppressUpdatesUntilLeave
        );

        /**
         * Desliza até o item mais próximo quando a rolagem para, para que soltar
         * no meio de uma transição nunca deixe um card aberto pela metade.
         *
         * Feito manualmente em vez de usar o `snap` do ScrollTrigger. Ele chama
         * `snapTo` com valores de progresso fora do intervalo do trigger —
         * recebeu −0,37 e −1,17 durante o carregamento — e age sobre o valor
         * retornado; assim, um retorno "não fazer nada" do mesmo valor rolou a
         * página completamente para fora do topo. Passar pelo smoother também
         * é exatamente o que um clique já faz, então ambos chegam ao mesmo
         * ponto por construção.
         */
        const settle = () => {
          settleTimerRef.current = null;

          const trigger = triggerRef.current;
          if (!trigger || !trigger.isActive) {
            // Não carregue a intenção de um gesto que aconteceu fora da
            // seção para a próxima entrada nela.
            inputKindRef.current = null;
            trackpadGestureRef.current = null;
            return;
          }
          if (suppressUpdatesRef.current) return;
          // Um clique já está animando em direção ao próprio alvo.
          if (jumpRef.current || isSettlingRef.current) return;

          // Lê da rolagem nativa, e não do progresso do próprio trigger: o
          // smoother ainda desliza até esta posição, que é o destino, enquanto
          // `progress` está onde o easing conseguiu chegar até agora. Mirar o
          // destino permite iniciar o ajuste cedo sem escolher o item que o
          // leitor já estava deixando.
          const span = trigger.end - trigger.start;
          if (span <= 0) return;
          const value = Math.min(
            1,
            Math.max(0, (window.scrollY - trigger.start) / span)
          );
          const direction = directionRef.current;
          const wheelIntent =
            inputKindRef.current === "wheel" ||
            inputKindRef.current === "trackpad";
          const trackpadIntent = inputKindRef.current === "trackpad";
          const trackpadGesture = trackpadGestureRef.current;

          // Depois que um gesto de trackpad já escolheu uma âncora, os deltas
          // residuais desse mesmo gesto não podem iniciar outro snap.
          if (trackpadIntent && trackpadGesture?.handled) return;

          let index: number;
          let from: number;

          if (wheelIntent) {
            // Uma roda pode produzir um delta muito pequeno, principalmente
            // em mouses de alta resolução. Ainda assim, ela representa a
            // intenção de avançar uma seção; exigir uma distância mínima aqui
            // fazia esse gesto ser interpretado como uma volta para a âncora.
            // Em trackpads, todos os deltas do gesto já foram agrupados antes
            // de chegar aqui, então a sequência também avança só um card.
            const currentIndex = Math.min(
              restPoints.length - 1,
              Math.max(0, activeRef.current)
            );
            from = restPoints[currentIndex];
            index = currentIndex + direction;
            if (index < 0 || index >= restPoints.length) {
              if (trackpadIntent && trackpadGesture) {
                trackpadGesture.handled = true;
              } else {
                inputKindRef.current = null;
              }
              return;
            }
          } else {
            // Fora dos pontos de repouso extremos, nada está no meio de uma
            // transição — o primeiro e o último item já estão inteiros —,
            // então deixa o leitor em paz ao entrar ou sair da seção.
            if (
              direction > 0
                ? value < firstRest || value >= lastRest
                : value > lastRest || value <= firstRest
            ) {
              inputKindRef.current = null;
              return;
            }

            // A âncora de destino é decidida pela direção, não pela distância.
            // Escolher apenas a mais próxima funciona para um gesto longo; para
            // qualquer gesto menor, a âncora mais próxima é aquela que o leitor
            // está tentando deixar, então isso o arrastaria de volta.
            //
            // Derivada da posição a cada vez, em vez de ser lembrada: uma
            // "âncora de origem" armazenada fica errada assim que um deslize é
            // interrompido, e um deslize interrompido a deixou segurando o
            // *alvo* abandonado. O ajuste seguinte lia a página como se
            // estivesse atrás do início, concluía que o leitor voltava e o
            // retornava um passo — na tela, o card avançava e depois voltava.
            const behind = restPoints.filter((point) =>
              direction > 0 ? point <= value : point >= value
            );
            from =
              behind.length === 0
                ? restPoints[direction > 0 ? 0 : restPoints.length - 1]
                : direction > 0
                  ? Math.max(...behind)
                  : Math.min(...behind);
            index = restPoints.indexOf(from);

            const ahead = index + direction;
            if (ahead >= 0 && ahead < restPoints.length) {
              const gap = Math.abs(restPoints[ahead] - from);
              if (Math.abs(value - from) > gap * RETURN_TOLERANCE) {
                index = ahead;
              }
            }
          }

          const nearest = restPoints[index];
          if (Math.abs(nearest - value) < SETTLE_EPSILON) {
            if (trackpadIntent && trackpadGesture) {
              trackpadGesture.handled = true;
            }
            return;
          }

          // `index` só saiu de `from` se o leitor ultrapassou a tolerância,
          // então isso significa que "ele decidiu para onde está indo". Se
          // ainda está rolando sem decidir, deixa como está — mas verifica
          // novamente quando a entrada realmente parar, senão um card aberto
          // pela metade poderia permanecer assim para sempre.
          const hasCommitted = nearest !== from;
          const sinceInput = Date.now() - lastInputAtRef.current;
          if (!wheelIntent && !hasCommitted && sinceInput < INPUT_SETTLED) {
            settleTimerRef.current = window.setTimeout(
              settle,
              INPUT_SETTLED - sinceInput + 20
            );
            return;
          }

          const target = trigger.start + span * nearest;
          if (trackpadIntent && trackpadGesture) {
            trackpadGesture.handled = true;
          } else {
            inputKindRef.current = null;
          }

          isSettlingRef.current = true;
          window.setTimeout(() => {
            isSettlingRef.current = false;
          }, SETTLE_TIMEOUT);
          settleTweenRef.current?.kill();

          const landed = () => {
            settleTweenRef.current = null;
            isSettlingRef.current = false;
          };

          // Entregue ao smoother, que é o único dono da posição de rolagem
          // enquanto está ativo — a mesma chamada usada pelo caminho de
          // clique-para-card.
          //
          // As duas alternativas foram medidas e ambas entram em conflito.
          // Escrever `scrollTo(v, false)` quadro a quadro a partir de um tween
          // iniciado em `smoother.scrollTop()` usa o valor *suavizado*, que fica
          // atrasado enquanto o lerp do smoother ainda corre até o valor nativo:
          // em um gesto, a página deslizou até o progresso 0,904, voltou a
          // 0,628 quando as escritas do tween venceram e repetiu a transição.
          // Animar a rolagem nativa é filtrado pelo smoother — 0,85s de tween
          // a moveu 34px de 496 —, deixando um platô visível no caminho.
          const smoother = ScrollSmoother.get();
          if (smoother) {
            smoother.scrollTo(target, true);
            window.setTimeout(landed, SETTLE_TIMEOUT);
            return;
          }

          settleTweenRef.current = gsap.to(window, {
            scrollTo: { y: target, autoKill: false },
            duration: SETTLE_DURATION,
            ease: SETTLE_EASE,
            overwrite: true,
            onComplete: landed,
          });
        };

        const setBoundaryState = (index: number, progress: number) => {
          progressValueRef.current = progress;
          progressRef.current?.style.setProperty(
            "--progress",
            String(progress)
          );
          tl?.progress(progress);
          activeRef.current = index;
          setActiveIndex(index);
        };

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          // A seção inteira tem `count * viewportsPerItem` viewports de altura;
          // uma delas é gasta parada enquanto a seção está fixada.
          end: () =>
            `+=${count * viewportsPerItem * window.innerHeight - window.innerHeight}`,
          pin,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (suppressUpdatesRef.current) return;

            progressRef.current?.style.setProperty(
              "--progress",
              String(self.progress)
            );

            progressValueRef.current = self.progress;

            // Controla o scrub diretamente pelo progresso, e não pelo `scrub`
            // do ScrollTrigger, para que a geometria siga a posição suavizada
            // pelo smoother.
            tl?.progress(self.progress);

            const position = self.progress * count;
            const current = activeRef.current;

            // Mantém o item atual até que a posição atravesse sua zona pela
            // faixa de tolerância, evitando que uma oscilação no limite alterne
            // o item de um lado para outro. Quando a geometria usa scrub, lê o
            // índice dela — de outro modo, os dois discordariam no meio da
            // transição.
            const next = deriveIndex
              ? deriveIndex(pin)
              : position < current - HYSTERESIS ||
                  position > current + 1 + HYSTERESIS
                ? Math.min(count - 1, Math.max(0, Math.floor(position)))
                : current;

            // No meio de um salto: mantém o alvo aberto e deixa a rolagem passar
            // por baixo, para que os itens intermediários nunca pisquem. Essa
            // liberação precisa ocorrer nos DOIS caminhos — quando ocorria
            // apenas no caminho sem scrub, qualquer clique deixava o salto
            // preso e o rótulo congelava enquanto a geometria continuava.
            const jump = jumpRef.current;
            if (jump) {
              if (next === jump.index || Date.now() > jump.expires) {
                jumpRef.current = null;
              }
              return;
            }

            if (next !== current) {
              activeRef.current = next;
              setActiveIndex(next);
            }
          },
          // Um CTA em outra parte da página pode rolar diretamente além desta
          // seção, então um salto em andamento nunca alcançaria o alvo. Sair
          // redefine onde fica o "aqui", para que voltar não meça o primeiro
          // movimento do leitor contra um ponto de repouso antigo.
          onLeave: () => {
            suppressUpdatesRef.current = false;
            jumpRef.current = null;
            inputKindRef.current = null;
            trackpadGestureRef.current = null;
            clearSettle();
            // Se um CTA atravessou a seção enquanto as atualizações estavam
            // congeladas, consolida o último ponto antes de ela sair. Assim,
            // ao voltar, a seção começa no último item em vez de saltar do
            // item que estava aberto quando o CTA foi clicado.
            setBoundaryState(count - 1, 1);
          },
          onLeaveBack: () => {
            suppressUpdatesRef.current = false;
            jumpRef.current = null;
            inputKindRef.current = null;
            trackpadGestureRef.current = null;
            clearSettle();
            setBoundaryState(0, 0);
          },
        });

        triggerRef.current = trigger;

        const scheduleSettle = () => {
          const y = window.scrollY;
          // Durante o snap, o ScrollSmoother continua emitindo scroll enquanto
          // desacelera. Esses eventos podem parecer estar na direção contrária
          // ao gesto original; não deixe a inércia substituir a intenção da
          // roda antes que o ajuste termine.
          if (y !== lastScrollRef.current && Date.now() >= directionLockUntilRef.current) {
            directionRef.current = y > lastScrollRef.current ? 1 : -1;
            lastScrollRef.current = y;
          }
          clearSettle();
          // O smoother continua a transição visual até a âncora escolhida;
          // não espere o evento de parada dele para começar o snap.
          const trackpadDelay =
            TRACKPAD_SETTLE_DELAY -
            (Date.now() - lastInputAtRef.current);
          const delay =
            inputKindRef.current === "trackpad"
              ? Math.max(SETTLE_DELAY, trackpadDelay)
              : SETTLE_DELAY;
          settleTimerRef.current = window.setTimeout(settle, delay);
        };

        // O evento de entrada ocorre antes do scroll nativo. Reagenda no
        // próximo ciclo para ler a posição atualizada e iniciar o snap logo
        // depois que o último gesto terminar.
        const setDirectionFromInput = (event: Event) => {
          let direction = 0;
          let isTrackpad = false;

          if (event.type === "wheel") {
            const wheelEvent = event as WheelEvent;
            const deltaY = Number(wheelEvent.deltaY);
            direction = deltaY > 0 ? 1 : deltaY < 0 ? -1 : 0;

            // Mouse wheels normalmente entregam um passo grande (ou deltas
            // em linhas). O trackpad entrega pixels pequenos e consecutivos;
            // marcá-los aqui permite que scheduleSettle faça debounce do
            // gesto inteiro, sem mudar o comportamento de um passo do mouse.
            isTrackpad =
              wheelEvent.deltaMode === WheelEvent.DOM_DELTA_PIXEL &&
              Math.abs(deltaY) < TRACKPAD_DELTA_LIMIT;
          } else if (event.type === "keydown") {
            const key = (event as KeyboardEvent).key;
            direction =
              key === "ArrowDown" || key === "PageDown" || key === "End" || key === " "
                ? 1
                : key === "ArrowUp" || key === "PageUp" || key === "Home"
                  ? -1
                  : 0;
          }

          if (direction !== 0) {
            if (isTrackpad) {
              const now = Date.now();
              const previous = trackpadGestureRef.current;
              const gesture =
                previous && now - previous.lastInputAt <= TRACKPAD_GESTURE_TIMEOUT
                  ? previous
                  : { direction, lastInputAt: now, handled: false };
              gesture.lastInputAt = now;
              trackpadGestureRef.current = gesture;
              inputKindRef.current = "trackpad";
              // A reversal while the fingers are still down belongs to the
              // same gesture; use its initial direction and wait for the
              // gesture to end before snapping.
              directionRef.current = gesture.direction;
            } else {
              directionRef.current = direction;
              trackpadGestureRef.current = null;
              if (event.type === "wheel") inputKindRef.current = "wheel";
            }
            directionLockUntilRef.current = Date.now() + SETTLE_TIMEOUT;
            if (event.type !== "wheel") {
              inputKindRef.current = "keyboard";
              trackpadGestureRef.current = null;
            }
          }
        };

        const scheduleSettleAfterInput = (event: Event) => {
          setDirectionFromInput(event);
          lastInputAtRef.current = Date.now();
          window.setTimeout(scheduleSettle, 0);
        };

        // Interagir novamente com a página cancela o ajuste pendente e qualquer
        // ajuste em andamento, para nunca puxar contra uma rolagem ativa.
        const cancelJump = (event: Event) => {
          setDirectionFromInput(event);
          lastInputAtRef.current = Date.now();

          // O fim de uma sequência de deltas pequenos já iniciou o snap. Não
          // o interrompa a cada evento residual do mesmo gesto de trackpad.
          if (
            event.type === "wheel" &&
            inputKindRef.current === "trackpad" &&
            trackpadGestureRef.current?.handled
          ) {
            return;
          }

          suppressUpdatesRef.current = false;
          jumpRef.current = null;
          isSettlingRef.current = false;
          clearSettle();
          settleTweenRef.current?.kill();
          settleTweenRef.current = null;
        };
        window.addEventListener("wheel", cancelJump, { passive: true });
        window.addEventListener("touchstart", cancelJump, { passive: true });

        window.addEventListener("wheel", scheduleSettleAfterInput, {
          passive: true,
        });
        window.addEventListener("touchmove", scheduleSettleAfterInput, {
          passive: true,
        });
        window.addEventListener("keydown", scheduleSettleAfterInput);
        const settleAfterSmootherStops = () => settle();
        window.addEventListener("scroll", scheduleSettle, { passive: true });
        window.addEventListener(
          "baita:smooth-scroll-stop",
          settleAfterSmootherStops
        );

        return () => {
          unsubscribeContactRequest();
          tl?.kill();
          clearSettle();
          settleTweenRef.current?.kill();
          settleTweenRef.current = null;
          isSettlingRef.current = false;
          window.removeEventListener("wheel", cancelJump);
          window.removeEventListener("touchstart", cancelJump);
          window.removeEventListener("wheel", scheduleSettleAfterInput);
          window.removeEventListener("touchmove", scheduleSettleAfterInput);
          window.removeEventListener("keydown", scheduleSettleAfterInput);
          window.removeEventListener("scroll", scheduleSettle);
          window.removeEventListener(
            "baita:smooth-scroll-stop",
            settleAfterSmootherStops
          );
          triggerRef.current = null;
          directionLockUntilRef.current = 0;
          inputKindRef.current = null;
          trackpadGestureRef.current = null;
          suppressUpdatesRef.current = false;
          setIsEnabled(false);
          activeRef.current = 0;
          setActiveIndex(0);
        };
      }
    );

    return () => mm.revert();
  }, [count, viewportsPerItem, minWidth, buildTimeline, deriveIndex]);

  /** Rola até o deslocamento que torna `index` o item ativo. */
  const scrollToIndex = useCallback(
    (index: number) => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      suppressUpdatesRef.current = false;
      inputKindRef.current = null;
      trackpadGestureRef.current = null;

      const progress = progressForIndex
        ? progressForIndex(index)
        : (index + 0.5) / count;
      const target =
        trigger.start + (trigger.end - trigger.start) * progress;

      // Abre o alvo imediatamente e deixa a rolagem alcançá-lo, para que os
      // itens intermediários nunca pisquem abertos no caminho.
      activeRef.current = index;
      setActiveIndex(index);
      jumpRef.current = { index, expires: Date.now() + JUMP_TIMEOUT };

      const smoother = ScrollSmoother.get();
      if (smoother) {
        smoother.scrollTo(target, true);
        return;
      }

      gsap.to(window, {
        scrollTo: { y: target, autoKill: true },
        duration: 0.6,
        ease: "power2.inOut",
        overwrite: true,
      });
    },
    [count, progressForIndex]
  );

  return {
    sectionRef,
    pinRef,
    progressRef,
    activeIndex,
    isEnabled,
    scrollToIndex,
  };
}
