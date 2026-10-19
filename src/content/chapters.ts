import type { PartId } from "./geometry";

export type CardCopy = {
  name: string;
  headline: string;
  bullets: [string, string];
};

export type Chapter = {
  id: string;
  /** Rail label and animated header title. */
  title: string;
  /** "01".."04" for the four part chapters, used by the "02 / 04" counter. */
  partNumber?: string;
  /** Part that is brought forward during this chapter. */
  focus?: PartId;
  /** Normalised scroll range: 0..1 over the whole story. */
  start: number;
  end: number;
  card?: CardCopy;
  hero?: { title: string; lead: string; hint: string };
  closing?: { lead: string; cta: string; href: string };
};

/**
 * Single source of truth for the whole story. Edit copy / ranges here — the
 * animation code in `lib/story.ts` only reads this array.
 */
export const CHAPTERS: Chapter[] = [
  {
    id: "hero",
    title: "Introduction",
    start: 0,
    end: 0.1,
    hero: {
      // DRAFT
      title: "PCUnfold",
      // DRAFT
      lead: "An exploded view of your PC.",
      // DRAFT
      hint: "Scroll to unfold",
    },
  },
  {
    id: "unfold",
    title: "Unfold",
    start: 0.1,
    end: 0.3,
  },
  {
    id: "monitor",
    title: "Monitor",
    partNumber: "01",
    focus: "monitor",
    start: 0.3,
    end: 0.48,
    card: {
      name: "Monitor",
      // DRAFT
      headline: "Your window into everything the PC does.",
      // DRAFT
      bullets: [
        "Resolution and panel type define clarity and colour.",
        "High refresh rates make fast motion look fluid.",
      ],
    },
  },
  {
    id: "tower",
    title: "PC Tower",
    partNumber: "02",
    focus: "tower",
    start: 0.48,
    end: 0.66,
    card: {
      name: "PC Tower",
      // DRAFT
      headline: "The house where all the computing happens.",
      // DRAFT
      bullets: [
        "Holds the CPU, GPU, RAM, storage and power supply.",
        "Airflow and fans decide thermals and noise.",
      ],
    },
  },
  {
    id: "keyboard",
    title: "Keyboard",
    partNumber: "03",
    focus: "keyboard",
    start: 0.66,
    end: 0.82,
    card: {
      name: "Keyboard",
      // DRAFT
      headline: "Your primary input — letters, shortcuts, macros.",
      // DRAFT
      bullets: [
        "Mechanical and membrane switches change feel and sound.",
        "N-key rollover registers every simultaneous press.",
      ],
    },
  },
  {
    id: "mouse",
    title: "Mouse",
    partNumber: "04",
    focus: "mouse",
    start: 0.82,
    end: 0.94,
    card: {
      name: "Mouse",
      // DRAFT
      headline: "Point, click, scroll — the fastest way to interact.",
      // DRAFT
      bullets: [
        "Sensor DPI controls cursor speed and precision.",
        "Ergonomic shape matters for long sessions.",
      ],
    },
  },
  {
    id: "reassemble",
    title: "Reassemble",
    start: 0.94,
    end: 1,
    closing: {
      // DRAFT
      lead: "Everything, put back together.",
      cta: "Get started",
      href: "#",
    },
  },
];
