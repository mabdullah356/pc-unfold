export const PART_IDS = ["monitor", "tower", "keyboard", "mouse"] as const;
export type PartId = (typeof PART_IDS)[number];

export type Vec = { x: number; y: number; scale: number };

/**
 * Offsets (px) applied on top of each part's CSS "assembled" position while
 * the scene is unfolded. Desktop values are tuned so nothing leaves the stage.
 */
export const EXPLODED_DESKTOP: Record<PartId, Vec> = {
  monitor: { x: 0, y: -130, scale: 0.9 },
  tower: { x: -150, y: -40, scale: 0.9 },
  keyboard: { x: 20, y: 130, scale: 0.9 },
  mouse: { x: 110, y: 110, scale: 0.9 },
};

/** Smaller spread for the narrower mobile stage. */
export const EXPLODED_MOBILE: Record<PartId, Vec> = {
  monitor: { x: 0, y: -80, scale: 0.9 },
  tower: { x: -55, y: -25, scale: 0.9 },
  keyboard: { x: 12, y: 85, scale: 0.9 },
  mouse: { x: 55, y: 65, scale: 0.9 },
};

/**
 * Focus transform per part. The stage sits in the right half on desktop, so
 * the focused part only ever drifts toward the stage centre/right, leaving the
 * left column free for the description card.
 */
export const FOCUS_DESKTOP: Record<PartId, Vec> = {
  monitor: { x: 40, y: 30, scale: 1.25 },
  tower: { x: 190, y: 20, scale: 1.35 },
  keyboard: { x: 60, y: -10, scale: 1.2 },
  mouse: { x: 40, y: 10, scale: 1.5 },
};

/** On mobile the focused part lifts up so the card can sit at the bottom. */
export const FOCUS_MOBILE: Record<PartId, Vec> = {
  monitor: { x: 0, y: -110, scale: 1.12 },
  tower: { x: 30, y: -100, scale: 1.12 },
  keyboard: { x: 0, y: -110, scale: 1.08 },
  mouse: { x: 20, y: -100, scale: 1.3 },
};
