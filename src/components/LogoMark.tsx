"use client";

import { useRef, useEffect } from "react";
import { initLogoAnimation } from "@/lib/logoMotion";

export default function LogoMark({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const cleanup = initLogoAnimation(svgRef.current);
    return cleanup;
  }, []);

  return (
    <svg
      ref={svgRef}
      id="logoMark"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="24 12 360 104"
      className={className}
      aria-hidden="true"
    >
      {/* K – vertical bottom */}
      <g data-stick id="stick-1">
        <line x1="68.19" y1="69.71" x2="68.19" y2="108.21" />
      </g>
      {/* K – vertical top */}
      <g data-stick id="stick-2">
        <line x1="68.19" y1="38.41" x2="68.19" y2="58.51" />
      </g>
      {/* K – lower-right arm */}
      <g data-stick id="stick-3">
        <line x1="190.29" y1="106.41" x2="78.89" y2="64.21" />
      </g>
      {/* K – upper-left arm */}
      <g data-stick id="stick-4">
        <line x1="134.59" y1="85.31" x2="29.89" y2="45.71" />
      </g>
      {/* K – diagonal */}
      <g data-stick id="stick-5">
        <line x1="185.19" y1="16.51" x2="70.89" y2="60.31" />
      </g>
      {/* I – diagonal */}
      <g data-stick id="stick-6">
        <line x1="346.29" y1="20.81" x2="215.39" y2="110.31" />
      </g>
      {/* I – horizontal */}
      <g data-stick id="stick-7">
        <line x1="378.89" y1="63.71" x2="305.49" y2="63.71" />
      </g>
    </svg>
  );
}
