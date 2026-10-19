import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Wires Lenis to the GSAP ticker so ScrollTrigger stays in sync, and returns a
 * `scrollTo` that falls back to native scrolling when motion is reduced.
 */
export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ smoothWheel: true });
    lenisRef.current = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time: number) => lenis.raf(time);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback((y: number) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(y, { duration: 0.9 });
      return;
    }
    window.scrollTo({
      top: y,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  return { scrollTo };
}
