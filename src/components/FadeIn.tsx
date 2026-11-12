import { type ReactNode } from "react";

/** Content must remain visible before hydration and without JavaScript. */
export default function FadeIn({ children, className = "" }: { children: ReactNode; className?: string; delay?: number }) {
  return <div className={className}>{children}</div>;
}
