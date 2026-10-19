import type { RefObject } from "react";
import type { PartId } from "../content/geometry";

import setupImg from "../assets/images/setup.jpg";
import monitorImg from "../assets/images/monitor.jpg";
import towerImg from "../assets/images/cpu.jpg";
import keyboardImg from "../assets/images/keyboard.jpg";
import mouseImg from "../assets/images/mouse.jpg";

type PartAsset = { src: string; cls: string };

const PART_ASSETS: Record<PartId, PartAsset> = {
  monitor: { src: monitorImg, cls: "part-monitor" },
  tower: { src: towerImg, cls: "part-tower" },
  keyboard: { src: keyboardImg, cls: "part-keyboard" },
  mouse: { src: mouseImg, cls: "part-mouse" },
};

const PART_ORDER = Object.keys(PART_ASSETS) as PartId[];

type Props = {
  setup: RefObject<HTMLImageElement | null>;
  parts: Record<PartId, RefObject<HTMLImageElement | null>>;
};

/**
 * The pinned, full-viewport scene. All animation is driven externally by
 * GSAP writing transform / opacity; this component only owns the markup and
 * the element refs.
 */
export function Scene({ setup, parts }: Props) {
  return (
    <div
      className="scene-root"
      role="img"
      aria-label="A full desk setup that unfolds into a monitor, PC tower, keyboard and mouse"
    >
      <div className="scene-stage">
        <img
          ref={setup}
          src={setupImg}
          alt=""
          width={1024}
          height={572}
          decoding="async"
          fetchPriority="high"
          draggable={false}
          className="setup-shot"
        />
        {PART_ORDER.map((id) => (
          <img
            key={id}
            ref={parts[id]}
            src={PART_ASSETS[id].src}
            alt=""
            width={720}
            height={720}
            decoding="async"
            draggable={false}
            className={`part ${PART_ASSETS[id].cls}`}
          />
        ))}
      </div>
    </div>
  );
}
