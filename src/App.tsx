import { lazy, Suspense } from "react";
import { useSmoothScroll } from "./lib/scroll";
import { PART_COPY } from "./content/parts";

const Scene = lazy(() => import("./three/Scene").then((m) => ({ default: m.Scene })));

const SECTIONS = ["hero", "explode", "screen", "tower", "keyboard", "mouse"] as const;

const SECTION_HEIGHT: Record<(typeof SECTIONS)[number], string> = {
  hero: "min-h-svh",
  explode: "min-h-[250vh]",
  screen: "min-h-[200vh]",
  tower: "min-h-[200vh]",
  keyboard: "min-h-[200vh]",
  mouse: "min-h-[200vh]",
};

const CARD_SIDE: Record<string, string> = {
  screen: "sm:items-start",
  tower: "sm:items-end",
  keyboard: "sm:items-start",
  mouse: "sm:items-end",
};

const SECTION_LABEL: Record<string, string> = {
  hero: "Introduction",
  explode: "Exploded view",
  screen: "Screen",
  tower: "PC Tower",
  keyboard: "Keyboard",
  mouse: "Mouse",
};

const PART_INDEX: Record<string, string> = {
  screen: "01",
  tower: "02",
  keyboard: "03",
  mouse: "04",
};

function LabelCard({ partId }: { partId: string }) {
  const copy = PART_COPY[partId];
  return (
    <div
      data-card={partId === "screen" ? "monitor" : partId}
      className="pointer-events-none w-[min(24rem,85vw)] overflow-hidden rounded-2xl bg-white opacity-0 shadow-[0_24px_60px_-15px_rgba(15,23,42,0.28)] ring-1 ring-slate-900/5 motion-reduce:opacity-100"
    >
      <div className="h-1 bg-gradient-to-r from-accent via-accent/50 to-transparent" />
      <div className="p-6">
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)]" />
          </span>
          <span data-anim className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
            Part {PART_INDEX[partId]} / 04
          </span>
        </div>
        <h2 data-anim className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          {copy.name}
        </h2>
        <p data-anim className="mt-1.5 text-sm leading-relaxed text-slate-500">
          {copy.blurb}
        </p>
        <ul className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
          {copy.points.map((point) => (
            <li
              key={point}
              data-anim
              className="flex items-start gap-3 text-sm text-slate-700"
            >
              <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function App() {
  useSmoothScroll();

  return (
    <>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      <main className="relative z-10">
        {SECTIONS.map((id) => (
          <section
            key={id}
            id={id}
            aria-label={SECTION_LABEL[id]}
            className={`flex justify-center px-6 ${SECTION_HEIGHT[id]}`}
          >
            {id === "hero" && (
              <div className="flex flex-col items-center justify-center text-center">
                <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
                  PC<span className="text-accent">Unfold</span>
                </h1>
                <p className="mt-4 text-text-dim">An exploded view of your PC.</p>
                <div className="mt-16 animate-bounce text-sm text-text-dim motion-reduce:animate-none">
                  Scroll to unfold
                </div>
              </div>
            )}
            {(id === "screen" || id === "tower" || id === "keyboard" || id === "mouse") && (
              <div
                className={`sticky top-0 flex h-svh w-full max-w-5xl items-end pb-12 sm:pb-0 ${
                  CARD_SIDE[id]
                }`}
              >
                <LabelCard partId={id} />
              </div>
            )}
          </section>
        ))}
      </main>
    </>
  );
}
