import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EXPLODED_XY, FOCUS_XY, PART_IDS, type PartId } from "../three/layout";
import { prefersReducedMotion } from "./scroll";
import type { PartRefs } from "./explode";

gsap.registerPlugin(ScrollTrigger);

const SECTION_OF: Record<PartId, string> = {
  monitor: "screen",
  tower: "tower",
  keyboard: "keyboard",
  mouse: "mouse",
};


export function useFocusAnimation(refs: PartRefs) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      for (const id of PART_IDS) {
        const el = refs[id].current;
        if (!el) continue;

        const [ex, ey] = EXPLODED_XY[id];
        const [fx, fy] = FOCUS_XY[id];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: `#${SECTION_OF[id]}`,
            start: "top 25%",
            end:   "bottom 25%",
            scrub: true,
          },
        });

        // 0-1  Enter: exploded → focus centre, scale up
        tl.fromTo(
          el,
          { x: ex, y: ey, scale: 1 },
          { x: fx, y: fy, scale: 1.18, ease: "none", duration: 1, immediateRender: false },
          0,
        )
        // 2-3  Exit: focus → back to exploded position
        .to(el, { x: ex, y: ey, scale: 1, ease: "none", duration: 1 }, 2);

        // Dim every OTHER part while this one is focused
        for (const otherId of PART_IDS) {
          if (otherId === id) continue;
          const other = refs[otherId].current;
          if (!other) continue;
          tl.to(other, { opacity: 0.15, duration: 1, ease: "none" }, 0)
            .to(other, { opacity: 1,    duration: 1, ease: "none" }, 2);
        }

        // Label card: container slides/fades in, contents stagger behind it
        const card = document.querySelector(`[data-card="${id}"]`);
        if (card) {
          const items = card.querySelectorAll("[data-anim]");

          tl.fromTo(
            card,
            { opacity: 0, y: 44 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              immediateRender: false,
            },
            0,
          );

          tl.fromTo(
            items,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.07,
              ease: "power2.out",
              immediateRender: false,
            },
            0.3,
          );

          tl.to(card, { opacity: 0, y: 28, duration: 0.8, ease: "power1.in" }, 2.2);

          const st = tl.scrollTrigger;
          if (st) {
            st.vars.onToggle = (self: ScrollTrigger) => {
              gsap.set(card, {
                willChange: self.isActive ? "transform, opacity" : "auto",
              });
            };
          }
        }
      }
    });

    return () => { ctx.revert(); };
  }, [refs]);
}
