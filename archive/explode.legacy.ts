import { useEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EXPLODED_XY, PART_IDS } from "../three/layout";
import { prefersReducedMotion } from "./scroll";

gsap.registerPlugin(ScrollTrigger);

export type PartRefs = {
  setup:    RefObject<HTMLImageElement | null>;
  monitor:  RefObject<HTMLImageElement | null>;
  tower:    RefObject<HTMLImageElement | null>;
  keyboard: RefObject<HTMLImageElement | null>;
  mouse:    RefObject<HTMLImageElement | null>;
};

const FADE = 0.15;

export function useExplodeAnimation(refs: PartRefs) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#explode",
          start: "top bottom",
          end:   "bottom 25%",
          scrub: true,
        },
      });

      // Phase 1: cross-fade the full setup image out, the parts in
      if (refs.setup.current) {
        tl.fromTo(
          refs.setup.current,
          { opacity: 1 },
          { opacity: 0, duration: FADE, ease: "none", immediateRender: false },
          0,
        );
      }

      for (const id of PART_IDS) {
        const el = refs[id].current;
        if (!el) continue;
        const [ex, ey] = EXPLODED_XY[id];

        tl.fromTo(
          el,
          { opacity: 0 },
          { opacity: 1, duration: FADE, ease: "none", immediateRender: false },
          0,
        );

        // Phase 2: slide apart
        tl.fromTo(
          el,
          { x: 0, y: 0 },
          { x: ex, y: ey, duration: 1 - FADE, ease: "none", immediateRender: false },
          FADE,
        );
      }
    });

    return () => { ctx.revert(); };
  }, [refs]);
}
