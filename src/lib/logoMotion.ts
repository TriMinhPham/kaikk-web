/**
 * Per-stick initial assembly offsets: [tx, ty, rotation].
 */
const ASSEMBLY: Record<string, [number, number, number]> = {
  "stick-1": [-35, 22, 360],
  "stick-2": [35, -30, -360],
  "stick-3": [45, 25, 360],
  "stick-4": [-45, -40, -360],
  "stick-5": [40, -22, 360],
  "stick-6": [45, -35, -360],
  "stick-7": [-40, 38, 360],
};

/**
 * Initialise the logo-mark stick animation using the Web Animations API.
 *
 * 1. Intro: sticks assemble from scattered offsets (plays once).
 * 2. Loop: sticks spin in place (infinite).
 *
 * Returns a cleanup function that cancels animations and removes listeners.
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

  const animations: Animation[] = [];
  let killed = false;

  /* ── Phase 1: assembly intro (plays once) ── */
  let longestIntro: Animation | null = null;

  sticks.forEach((g, i) => {
    const id = g.id;
    const [tx, ty, r] = ASSEMBLY[id] ?? [0, 0, 0];

    const anim = g.animate(
      [
        { transform: `translate(${tx}px, ${ty}px) rotate(0deg)` },
        { transform: `translate(0px, 0px) rotate(${r}deg)` },
      ],
      {
        duration: 1200,
        delay: i * 80,
        easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", // power3.out equivalent
        fill: "forwards",
      },
    );
    animations.push(anim);

    if (!longestIntro || (i * 80 + 1200) > ((animations.indexOf(longestIntro!) > -1 ? 0 : 0) + 1200)) {
      longestIntro = anim;
    }
  });

  // Find the last intro animation to finish
  const lastIntro = animations[animations.length - 1];

  /* ── Phase 2: spin-in-place loop (starts after intro) ── */
  lastIntro.addEventListener("finish", () => {
    if (killed) return;

    // Reset transforms and start spin cycle
    sticks.forEach((g) => {
      // Cancel intro fill to allow spin
      g.getAnimations().forEach((a) => a.cancel());
      g.style.transform = "";
    });

    sticks.forEach((g, i) => {
      const spin = i % 2 === 0 ? 360 : -360;

      const anim = g.animate(
        [
          { transform: `rotate(0deg)` },
          { transform: `rotate(${spin}deg)` },
        ],
        {
          duration: (5 + i * 0.2) * 1000,
          iterations: Infinity,
          easing: "linear",
        },
      );
      animations.push(anim);
    });
  });

  /* ── Pause when tab is hidden, resume when visible ── */
  const onVisibility = () => {
    if (document.hidden) {
      animations.forEach((a) => {
        if (a.playState === "running") a.pause();
      });
    } else {
      animations.forEach((a) => {
        if (a.playState === "paused") a.play();
      });
    }
  };
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    killed = true;
    animations.forEach((a) => a.cancel());
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
