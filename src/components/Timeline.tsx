import { useEffect, useRef } from "react";
import type { CSSProperties, RefObject } from "react";
import gsap from "gsap";
import type { Chapter } from "../content/chapters";

type Props = {
  chapters: Chapter[];
  active: number;
  onSelect: (chapter: Chapter) => void;
  rootRef: RefObject<HTMLElement | null>;
};

/**
 * Progress rail (vertical on desktop, horizontal on mobile), a chapter counter
 * and an animated chapter title. The rail fill reads the `--story-progress`
 * custom property written directly to the DOM by the master timeline.
 */
export function Timeline({ chapters, active, onSelect, rootRef }: Props) {
  const titleRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const current = chapters[active];

  useEffect(() => {
    const targets = [titleRef.current, counterRef.current].filter(
      (el): el is HTMLSpanElement => el !== null,
    );
    if (targets.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tween = gsap.fromTo(
      targets,
      reduced ? { opacity: 0 } : { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", overwrite: true },
    );

    return () => {
      tween.kill();
    };
  }, [active]);

  return (
    <aside className="timeline" ref={rootRef}>
      <div className="timeline-head" aria-live="polite">
        {current.partNumber && (
          <span ref={counterRef} className="timeline-counter">
            {current.partNumber} / 04
          </span>
        )}
        <span ref={titleRef} className="timeline-title">
          {current.title}
        </span>
      </div>

      <div className="rail">
        <span className="rail-line" aria-hidden />
        <span className="rail-fill" aria-hidden />
        {chapters.map((chapter, index) => (
          <button
            key={chapter.id}
            type="button"
            className={`rail-node${index === active ? " is-active" : ""}${
              index < active ? " is-done" : ""
            }`}
            style={{ "--pos": chapter.start } as CSSProperties}
            aria-label={`Go to chapter ${index + 1}: ${chapter.title}`}
            aria-current={index === active}
            onClick={() => onSelect(chapter)}
          >
            <span className="rail-dot" aria-hidden />
          </button>
        ))}
      </div>
    </aside>
  );
}
