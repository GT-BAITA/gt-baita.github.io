import { useEffect, useRef, useState } from "react";

/**
 * Coordena a transformação do formulário de newsletter → aviso de sucesso.
 *
 * Ida: os campos recolhem (400ms) enquanto a pílula do CTA sobe e se torna
 * um badge de confirmação; depois, o bloco de obrigado entra em sequência.
 * Volta: o bloco desaparece de uma vez (200ms) e então os campos reabrem.
 *
 * Os dois painéis abrem e fecham no mesmo relógio. A altura do card nunca é
 * definida — ela acompanha as duas faixas do grid —, então as faixas precisam
 * se mover juntas para parecer um único gesto: com uma curva de easing E
 * compartilhada, a altura é `full − net · E(t)`, que é monotônica. Abrir o
 * segundo painel depois que o primeiro fechou faz o card passar visualmente
 * abaixo da altura final pela diferença e depois crescer de novo. O texto é
 * controlado por `is-shown`, sem alterar a altura.
 *
 * As durações são lidas das propriedades customizadas do CSS para manter os
 * temporizadores sincronizados com os valores de global.css.
 */

const HIDE_DURATION = 200; // .t-stagger.is-hiding, definido pelo snippet

function readDuration(name: string, fallback: number) {
  if (typeof window === "undefined") return fallback;

  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  if (!raw) return fallback;
  const value = parseFloat(raw);
  if (Number.isNaN(value)) return fallback;

  return raw.endsWith("ms") ? value : value * 1000;
}

export function useSuccessMorph(isSucceeded: boolean) {
  // `phase` fica atrás de isSucceeded na volta: ele controla o padding do
  // card e o CTA, ambos afetando a altura, então precisa mudar no mesmo
  // instante que as faixas do grid. Ler isSucceeded diretamente inicia o
  // padding 200ms antes e faz o card cair bem abaixo da altura final antes de
  // crescer novamente.
  const [phase, setPhase] = useState<"form" | "success">("form");
  const [fieldsOpen, setFieldsOpen] = useState(true);
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageState, setMessageState] = useState<"" | "is-shown" | "is-hiding">("");

  const checkRef = useRef<HTMLSpanElement | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const isFirstRun = useRef(true);

  // Calibra o desenho do traço ao comprimento real deste caminho, para que o
  // checkmark não apareça antes da hora nem seja desenhado além do necessário.
  useEffect(() => {
    const path = checkRef.current?.querySelector("path");
    if (!path) return;

    const length = Math.ceil(path.getTotalLength());
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
  }, []);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    if (isSucceeded) {
      setPhase("success");
      setFieldsOpen(false);
      setMessageOpen(true);

      const collapse = readDuration("--duration-slow", 400);
      const timer = window.setTimeout(() => setMessageState("is-shown"), collapse);

      return () => window.clearTimeout(timer);
    }

    setMessageState("is-hiding");

    const timer = window.setTimeout(() => {
      setPhase("form");
      setMessageOpen(false);
      setMessageState("");
      setFieldsOpen(true);
    }, HIDE_DURATION);

    return () => window.clearTimeout(timer);
  }, [isSucceeded]);

  // O bloco já está no DOM — a altura dele é o destino do tween do card —,
  // então aria-live não tem nada a anunciar. Em vez disso, move o foco, pois
  // o formulário em que o usuário estava desapareceu. É preciso aguardar a
  // renderização que remove `inert`: focar em uma subárvore inerte falha em
  // silêncio e deixa o foco em <body>.
  useEffect(() => {
    if (messageState !== "is-shown") return;
    messageRef.current?.focus({ preventScroll: true });
  }, [messageState]);

  return { phase, fieldsOpen, messageOpen, messageState, checkRef, messageRef };
}
