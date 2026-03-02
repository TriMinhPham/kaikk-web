import gsap from "gsap";

/**
 * Centre of each stick's bounding box (midpoint of the <line> coords).
 * Used to calculate translation offsets when sticks swap positions.
 */
const CENTRES: Record<string, [number, number]> = {
  "stick-1": [68.19, 88.96],
  "stick-2": [68.19, 48.46],
  "stick-3": [134.59, 85.31],
  "stick-4": [82.24, 65.51],
  "stick-5": [128.04, 38.41],
  "stick-6": [280.84, 65.56],
  "stick-7": [342.19, 63.71],
};

/**
 * Per-stick initial assembly offsets.
 * Large translations + full 360° rotations for a dramatic scattered entrance.
 */
const ASSEMBLY: Record<string, [number, number, number]> = {
  "stick-1": [-35, 22, 360], // centre ~(68,89)  y max headroom ≈ 27
  "stick-2": [35, -30, -360], // centre ~(68,48)  y min headroom ≈ -36
  "stick-3": [45, 25, 360], // centre ~(135,85) y max headroom ≈ 31
  "stick-4": [-45, -40, -360], // centre ~(82,66)  y min headroom ≈ -54
  "stick-5": [40, -22, 360], // centre ~(128,38) y min headroom ≈ -26
  "stick-6": [45, -35, -360], // centre ~(281,66) x max headroom ≈ 103
  "stick-7": [-40, 38, 360], // centre ~(342,64) x max headroom ≈ 42
};

/**
 * Fisher-Yates derangement: shuffle so NO element stays at its own index.
 * Guarantees every stick moves to a different stick's position.
 */
function derange<T>(arr: T[]): T[] {
  const result = [...arr];
  do {
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
  } while (result.some((v, i) => v === arr[i]));
  return result;
}

/**
 * Initialise the logo-mark stick animation.
 *
 * 1. Intro: sticks assemble from scattered offsets (plays once).
 * 2. Loop: sticks randomly swap positions + spin 360° (infinite).
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

  const ids = Array.from(sticks).map((g) => g.id);
  let killed = false;
  let activeTl: gsap.core.Timeline | null = null;

  /* ── Phase 1: assembly intro (plays once) ── */
  const intro = gsap.timeline({ paused: false });

  sticks.forEach((g, i) => {
    const id = g.id;
    const [tx, ty, r] = ASSEMBLY[id] ?? [0, 0, 0];

    gsap.set(g, { x: tx, y: ty });

    intro.to(
      g,
      {
        x: 0,
        y: 0,
        rotation: r,
        duration: 1.2,
        ease: "power3.out",
      },
      i * 0.08,
    );
  });

  /* ── Phase 2: spin-in-place loop ── */
  function spinCycle() {
    if (killed) return;

    const tl = gsap.timeline({
      onComplete: () => {
        sticks.forEach((g) => gsap.set(g, { rotation: 0 }));
        if (!killed) gsap.delayedCall(2, spinCycle);
      },
    });
    activeTl = tl;

    sticks.forEach((g, i) => {
      const spin = i % 2 === 0 ? 360 : -360;

      tl.to(
        g,
        {
          rotation: spin,
          duration: 5 + i * 0.2,
          ease: "none",
        },
        0,
      );
    });
  }

  intro.eventCallback("onComplete", () => {
    sticks.forEach((g) => gsap.set(g, { rotation: 0 }));
    spinCycle();
  });

  /* ── Pause when tab is hidden, resume when visible ── */
  const onVisibility = () => {
    if (document.hidden) {
      intro.pause();
      activeTl?.pause();
    } else {
      if (intro.progress() < 1) {
        intro.resume();
      } else {
        activeTl?.resume();
      }
    }
  };
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    killed = true;
    intro.kill();
    activeTl?.kill();
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
