import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis();
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time: number) => lenis.raf(time);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.off("scroll", onScroll);
      lenis.destroy();
    };
  }, []);
}
