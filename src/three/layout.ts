export const PART_IDS = ["monitor", "tower", "keyboard", "mouse"] as const;
export type PartId = (typeof PART_IDS)[number];

/**
 * Pixel x/y offsets GSAP adds on top of the CSS assembled position
 * when the parts "explode" apart during the scroll-through.
 */
export const EXPLODED_XY: Record<PartId, readonly [number, number]> = {
  monitor:  [0,    -140],   // flies straight up
  tower:    [-185,  -55],   // flies left + slightly up
  keyboard: [20,   155],    // flies down
  mouse:    [165,  125],    // flies right + down
};

/**
 * Absolute GSAP x/y values (from CSS assembled base = [0,0]) used when
 * a part is "focused" — brings it roughly to the centre of the scene stage.
 */
export const FOCUS_XY: Record<PartId, readonly [number, number]> = {
  monitor:  [0,    145],
  tower:    [281,   77],
  keyboard: [15,  -210],
  mouse:    [-292, -191],
};
