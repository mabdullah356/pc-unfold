import { useMemo, useRef } from "react";
import { useExplodeAnimation } from "../lib/explode";
import { useFocusAnimation } from "../lib/focus";
import type { PartRefs } from "../lib/explode";
import { prefersReducedMotion } from "../lib/scroll";
import { EXPLODED_XY, type PartId } from "./layout";

import setupImg from "../assets/images/setup.jpg";
import monitorImg from "../assets/images/monitor.jpg";
import towerImg from "../assets/images/cpu.jpg";
import keyboardImg from "../assets/images/keyboard.jpg";
import mouseImg from "../assets/images/mouse.jpg";

export function Scene() {
  const setup    = useRef<HTMLImageElement>(null);
  const monitor  = useRef<HTMLImageElement>(null);
  const tower    = useRef<HTMLImageElement>(null);
  const keyboard = useRef<HTMLImageElement>(null);
  const mouse    = useRef<HTMLImageElement>(null);

  const refs: PartRefs = useMemo(
    () => ({ setup, monitor, tower, keyboard, mouse }),
    [],
  );

  const reduced = useMemo(() => prefersReducedMotion(), []);

  useExplodeAnimation(refs);
  useFocusAnimation(refs);

  const partStyle = (id: PartId): React.CSSProperties =>
    reduced
      ? {
          transform: `translate(${EXPLODED_XY[id][0]}px, ${EXPLODED_XY[id][1]}px)`,
          opacity: 1,
        }
      : { opacity: 0 };

  return (
    <div
      className="scene-root"
      role="img"
      aria-label="PC setup: a full desk setup, then its individual parts — monitor, PC tower, keyboard and mouse"
    >
      <div className="scene-stage">
        <img
          ref={setup}
          src={setupImg}
          alt=""
          width={1024}
          height={572}
          decoding="async"
          draggable={false}
          className="setup-shot"
          style={reduced ? { opacity: 0 } : undefined}
        />
        <img
          ref={monitor}
          src={monitorImg}
          alt=""
          width={1024}
          height={1024}
          decoding="async"
          draggable={false}
          className="part part-monitor"
          style={partStyle("monitor")}
        />
        <img
          ref={tower}
          src={towerImg}
          alt=""
          width={1024}
          height={1024}
          decoding="async"
          draggable={false}
          className="part part-tower"
          style={partStyle("tower")}
        />
        <img
          ref={keyboard}
          src={keyboardImg}
          alt=""
          width={1024}
          height={1024}
          decoding="async"
          draggable={false}
          className="part part-keyboard"
          style={partStyle("keyboard")}
        />
        <img
          ref={mouse}
          src={mouseImg}
          alt=""
          width={1024}
          height={1024}
          decoding="async"
          draggable={false}
          className="part part-mouse"
          style={partStyle("mouse")}
        />
      </div>
    </div>
  );
}
