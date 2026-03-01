import gsap from "gsap";

/**
 * Per-stick drift offsets: [translateX, translateY, rotate]
 * Used for the infinite breathing loop.
 */
const DRIFT: Record<string, [number, number, number]> = {
  "stick-1": [0, 4, 3],
  "stick-2": [0, -4, -2.5],
  "stick-3": [5, 3, 4],
  "stick-4": [-5, -3, -4],
  "stick-5": [4, -4, 2.5],
  "stick-6": [4, -2.5, -3],
  "stick-7": [-3, 3.5, 2],
};

/**
 * Per-stick initial assembly offsets (bigger, for the intro).
 */
const ASSEMBLY: Record<string, [number, number, number]> = {
  "stick-1": [0, 12, 8],
  "stick-2": [0, -12, -6],
  "stick-3": [15, 8, 10],
  "stick-4": [-15, -8, -10],
  "stick-5": [10, -10, 6],
  "stick-6": [12, -6, -8],
  "stick-7": [-8, 10, 5],
};

/**
 * Initialise the logo-mark stick animation.
 *
 * 1. Intro: sticks assemble from scattered offsets (plays once).
 * 2. Loop: sticks gently drift back and forth forever (yoyo).
 *
 * Returns a cleanup function that kills timelines and removes listeners.
 */
export function initLogoAnimation(svg: SVGSVGElement): () => void {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReduced) {
    return () => {};
  }

  const sticks = svg.querySelectorAll<SVGGElement>("[data-stick]");
  if (sticks.length === 0) return () => {};

  /* ── Phase 1: assembly intro (plays once) ── */
  const intro = gsap.timeline({ paused: false });

  sticks.forEach((g, i) => {
    const id = g.id;
    const [tx, ty, r] = ASSEMBLY[id] ?? [0, 0, 0];

    intro.fromTo(
      g,
      { x: tx, y: ty, rotation: r },
      {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.7,
        ease: "power2.out",
      },
      i * 0.07,
    );
  });

  /* ── Phase 2: infinite breathing loop (starts after intro) ── */
  const loop = gsap.timeline({ paused: true, repeat: -1, yoyo: true });

  sticks.forEach((g, i) => {
    const id = g.id;
    const [tx, ty, r] = DRIFT[id] ?? [0, 0, 0];

    loop.to(
      g,
      {
        x: tx,
        y: ty,
        rotation: r,
        duration: 2.4 + i * 0.15, // slightly different durations per stick
        ease: "sine.inOut",
      },
      0, // all start together
    );
  });

  intro.eventCallback("onComplete", () => loop.play());

  /* ── Pause when tab is hidden, resume when visible ── */
  const onVisibility = () => {
    if (document.hidden) {
      intro.pause();
      loop.pause();
    } else {
      if (intro.progress() < 1) {
        intro.resume();
      } else {
        loop.resume();
      }
    }
  };
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    intro.kill();
    loop.kill();
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
