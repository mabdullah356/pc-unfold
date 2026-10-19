import { useEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTERS } from "../content/chapters";
import {
  EXPLODED_DESKTOP,
  EXPLODED_MOBILE,
  FOCUS_DESKTOP,
  FOCUS_MOBILE,
  PART_IDS,
  type PartId,
} from "../content/geometry";
import { prefersReducedMotion } from "./scroll";

gsap.registerPlugin(ScrollTrigger);

export type StoryRefs = Record<"setup" | PartId, RefObject<HTMLImageElement | null>>;

type PartPose = { x: number; y: number; scale: number; opacity: number };
type Pose = { setup: number; parts: Record<PartId, PartPose> };

/** Derives every element's target pose for a chapter. No animation runs here. */
function poseFor(index: number, desktop: boolean, reduced: boolean): Pose {
  const focus = CHAPTERS[index].focus;
  const focusMap = desktop ? FOCUS_DESKTOP : FOCUS_MOBILE;
  const exploded = desktop ? EXPLODED_DESKTOP : EXPLODED_MOBILE;
  const showSetup = index === 0 || index === 6;
  const parts = {} as Record<PartId, PartPose>;

  for (const id of PART_IDS) {
    let pose: PartPose;
    if (showSetup) {
      pose = { x: 0, y: 0, scale: 1, opacity: 0 };
    } else if (index === 1) {
      const e = exploded[id];
      pose = { x: e.x, y: e.y, scale: e.scale, opacity: 1 };
    } else if (id === focus) {
      const f = focusMap[id];
      pose = { x: f.x, y: f.y, scale: f.scale, opacity: 1 };
    } else {
      const e = exploded[id];
      pose = { x: e.x, y: e.y, scale: e.scale * 0.94, opacity: 0.16 };
    }
    parts[id] = reduced ? { x: 0, y: 0, scale: 1, opacity: pose.opacity } : pose;
  }

  return { setup: showSetup ? 1 : 0, parts };
}

function indexAt(progress: number): number {
  for (let i = CHAPTERS.length - 1; i >= 0; i--) {
    if (progress >= CHAPTERS[i].start) return i;
  }
  return 0;
}

type StoryOptions = {
  storyRef: RefObject<HTMLElement | null>;
  overlayRef: RefObject<HTMLElement | null>;
  cardHostRef: RefObject<HTMLElement | null>;
  refs: StoryRefs;
  onChapter: (index: number) => void;
  onProgress: (progress: number) => void;
};

/**
 * Builds ONE master, scroll-scrubbed timeline for the pinned scene. Every part
 * tween goes from the previous chapter's pose to the current one, so scrubbing
 * forward and backward is always consistent.
 */
export function useStory(opts: StoryOptions) {
  const { storyRef, overlayRef, cardHostRef, refs, onChapter, onProgress } = opts;

  useEffect(() => {
    const story = storyRef.current;
    if (!story) return;

    const reduced = prefersReducedMotion();
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const slide = reduced ? 0 : 1;

    const ctx = gsap.context(() => {
      const poses = CHAPTERS.map((_, i) => poseFor(i, desktop, reduced));

      // ── Initial state (hero / assembled) ───────────────────────────────
      for (const id of PART_IDS) {
        const el = refs[id].current;
        if (el) gsap.set(el, poses[0].parts[id]);
      }
      if (refs.setup.current) gsap.set(refs.setup.current, { opacity: poses[0].setup });

      const overlay = overlayRef.current;
      const hero = overlay?.querySelector<HTMLElement>("[data-hero]");
      const hint = overlay?.querySelector<HTMLElement>("[data-hint]");
      const closing = overlay?.querySelector<HTMLElement>("[data-closing]");

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: story,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            onProgress(self.progress);
            onChapter(indexAt(self.progress));
          },
        },
      });

      // Invisible spine so the timeline duration is exactly 1 (0 → 100%).
      tl.to({ v: 0 }, { v: 1, duration: 1, ease: "none" }, 0);

      // ── Chapter transitions ────────────────────────────────────────────
      for (let i = 1; i < CHAPTERS.length; i++) {
        const ch = CHAPTERS[i];
        const from = poses[i - 1];
        const to = poses[i];
        const len = ch.end - ch.start;
        const dur = Math.max(0.02, len * 0.55);

        PART_IDS.forEach((id, k) => {
          const el = refs[id].current;
          if (!el) return;
          tl.fromTo(
            el,
            { ...from.parts[id] },
            { ...to.parts[id], duration: dur, ease: "power2.inOut", immediateRender: false },
            ch.start + k * 0.012,
          );
        });

        if (refs.setup.current) {
          tl.fromTo(
            refs.setup.current,
            { opacity: from.setup },
            { opacity: to.setup, duration: dur, ease: "power2.inOut", immediateRender: false },
            ch.start,
          );
        }
      }

      // ── Hero / hint exit ───────────────────────────────────────────────
      if (hero) tl.to(hero, { opacity: 0, y: -20 * slide, duration: 0.05, ease: "power1.in" }, 0.06);
      if (hint) tl.to(hint, { opacity: 0, duration: 0.03, ease: "none" }, 0.045);

      // ── Description cards ──────────────────────────────────────────────
      const host = cardHostRef.current;
      for (const ch of CHAPTERS) {
        if (!ch.card) continue;
        const card = host?.querySelector<HTMLElement>(`[data-card="${ch.id}"]`);
        if (!card) continue;
        const items = card.querySelectorAll<HTMLElement>("[data-anim]");
        const len = ch.end - ch.start;

        tl.fromTo(
          card,
          { opacity: 0, y: 36 * slide },
          { opacity: 1, y: 0, duration: len * 0.22, ease: "power2.out", immediateRender: false },
          ch.start + len * 0.34,
        );
        if (items.length) {
          tl.fromTo(
            items,
            { opacity: 0, y: 16 * slide },
            {
              opacity: 1,
              y: 0,
              duration: len * 0.16,
              stagger: 0.025,
              ease: "power2.out",
              immediateRender: false,
            },
            ch.start + len * 0.42,
          );
        }
        tl.to(
          card,
          { opacity: 0, y: 20 * slide, duration: len * 0.12, ease: "power1.in" },
          ch.end - len * 0.12,
        );
      }

      // ── Closing block ──────────────────────────────────────────────────
      if (closing) {
        tl.fromTo(
          closing,
          { opacity: 0, y: 30 * slide },
          { opacity: 1, y: 0, duration: 0.03, ease: "power2.out", immediateRender: false },
          0.955,
        );
      }
    });

    return () => {
      ctx.revert();
    };
  }, [storyRef, overlayRef, cardHostRef, refs, onChapter, onProgress]);
}
