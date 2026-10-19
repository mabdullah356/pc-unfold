import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CHAPTERS, type Chapter } from "./content/chapters";
import { PART_IDS, type PartId } from "./content/geometry";
import { Scene } from "./components/Scene";
import { PartCard } from "./components/PartCard";
import { Timeline } from "./components/Timeline";
import { useSmoothScroll } from "./lib/scroll";
import { useStory, type StoryRefs } from "./lib/story";

const HERO = CHAPTERS[0];
const CLOSING = CHAPTERS[CHAPTERS.length - 1];
const CARD_CHAPTERS = CHAPTERS.filter((chapter) => chapter.card);

export default function App() {
  const setupRef = useRef<HTMLImageElement>(null);
  const monitorRef = useRef<HTMLImageElement>(null);
  const towerRef = useRef<HTMLImageElement>(null);
  const keyboardRef = useRef<HTMLImageElement>(null);
  const mouseRef = useRef<HTMLImageElement>(null);

  const refs = useMemo<StoryRefs>(
    () => ({
      setup: setupRef,
      monitor: monitorRef,
      tower: towerRef,
      keyboard: keyboardRef,
      mouse: mouseRef,
    }),
    [],
  );

  const partRefs = useMemo(
    () =>
      Object.fromEntries(PART_IDS.map((id) => [id, refs[id]])) as Record<
        PartId,
        typeof monitorRef
      >,
    [refs],
  );

  const storyRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardHostRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);

  const { scrollTo } = useSmoothScroll();
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  const onChapter = useCallback((index: number) => {
    if (activeRef.current === index) return;
    activeRef.current = index;
    setActive(index);
  }, []);

  const onProgress = useCallback((progress: number) => {
    railRef.current?.style.setProperty("--story-progress", progress.toFixed(4));
  }, []);

  useStory({ storyRef, overlayRef, cardHostRef, refs, onChapter, onProgress });

  // Keep `will-change` off the parts whenever the story is off-screen.
  useEffect(() => {
    const story = storyRef.current;
    if (!story) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        document.documentElement.classList.toggle("story-active", entry.isIntersecting);
      },
      { threshold: 0 },
    );
    observer.observe(story);
    return () => observer.disconnect();
  }, []);

  const onSelect = useCallback(
    (chapter: Chapter) => {
      const story = storyRef.current;
      if (!story) return;
      const offset = story.getBoundingClientRect().top + window.scrollY;
      const scrollable = story.offsetHeight - window.innerHeight;
      scrollTo(offset + chapter.start * scrollable);
    },
    [scrollTo],
  );

  return (
    <>
      <div ref={storyRef} className="story-scroll" aria-hidden="true" />

      <div ref={overlayRef} className="overlay">
        {HERO.hero && (
          <div className="hero-block" data-hero>
            <p className="hero-eyebrow">Interactive exploded view</p>
            <h1 className="hero-title">
              {HERO.hero.title.slice(0, 2)}
              <span>{HERO.hero.title.slice(2)}</span>
            </h1>
            <p className="hero-lead">{HERO.hero.lead}</p>
            <span className="hero-hint" data-hint>
              {HERO.hero.hint}
            </span>
          </div>
        )}

        <div ref={cardHostRef} className="card-host">
          {CARD_CHAPTERS.map((chapter) => (
            <PartCard
              key={chapter.id}
              partId={chapter.id}
              partNumber={chapter.partNumber ?? "00"}
              copy={chapter.card!}
            />
          ))}
        </div>

        {CLOSING.closing && (
          <div className="closing-block" data-closing>
            <p className="closing-lead">{CLOSING.closing.lead}</p>
            <a className="cta" href={CLOSING.closing.href}>
              {CLOSING.closing.cta}
            </a>
          </div>
        )}

        <Timeline chapters={CHAPTERS} active={active} onSelect={onSelect} rootRef={railRef} />
      </div>

      <Scene setup={setupRef} parts={partRefs} />
    </>
  );
}
