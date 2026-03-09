/**
 * Logo stick animation using the Web Animations API (no external deps).
 *
 * 1. Intro: sticks assemble from scattered offsets (plays once).
 * 2. Loop: sticks spin in place with a pause between cycles (infinite).
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

export function initLogoAnimation(svg: SVGSVGElement): () => void {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReduced) return () => {};

  const sticks = svg.querySelectorAll<SVGGElement>("[data-stick]");
  if (sticks.length === 0) return () => {};

  const animations: Animation[] = [];
  let killed = false;
  let spinTimeouts: ReturnType<typeof setTimeout>[] = [];

  /* ── Phase 1: assembly intro ── */
  let maxEnd = 0;
  sticks.forEach((g, i) => {
    const id = g.id;
    const [tx, ty, r] = ASSEMBLY[id] ?? [0, 0, 0];
    const delay = i * 80; // 0.08s stagger
    const duration = 1200;

    const anim = g.animate(
      [
        { transform: `translate(${tx}px, ${ty}px) rotate(0deg)` },
        { transform: `translate(0px, 0px) rotate(${r}deg)` },
      ],
      {
        duration,
        delay,
        easing: "cubic-bezier(0.33, 1, 0.68, 1)", // power3.out equivalent
        fill: "forwards",
      },
    );
    animations.push(anim);
    const end = delay + duration;
    if (end > maxEnd) maxEnd = end;
  });

  /* ── Phase 2: spin-in-place loop (starts after intro) ── */
  function spinCycle() {
    if (killed) return;

    sticks.forEach((g, i) => {
      const spin = i % 2 === 0 ? 360 : -360;
      const duration = (5 + i * 0.2) * 1000;

      const anim = g.animate(
        [
          { transform: `rotate(0deg)` },
          { transform: `rotate(${spin}deg)` },
        ],
        {
          duration,
          easing: "linear",
          fill: "forwards",
        },
      );
      animations.push(anim);
    });

    // Schedule next cycle after longest spin + 2s pause
    const longest = (5 + (sticks.length - 1) * 0.2) * 1000;
    const tid = setTimeout(() => {
      // Reset transforms before next cycle
      sticks.forEach((g) => {
        g.style.transform = "";
      });
      spinCycle();
    }, longest + 2000);
    spinTimeouts.push(tid);
  }

  const introTid = setTimeout(() => {
    // Clear intro fill states
    sticks.forEach((g) => {
      g.style.transform = "";
    });
    spinCycle();
  }, maxEnd);
  spinTimeouts.push(introTid);

  /* ── Pause when tab is hidden ── */
  const onVisibility = () => {
    if (document.hidden) {
      animations.forEach((a) => a.pause());
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
    spinTimeouts.forEach((t) => clearTimeout(t));
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
