/**
 * Tokyo city-context photograph (Unsplash; see docs/customer-credibility-redesign.md).
 * Not a representation of KAI's office. Variants are pre-rendered in grayscale by
 * scripts/optimize-images.py so the browser no longer downloads a 1400px JPEG
 * and applies a CSS filter on phones.
 */
export default function HeroPhoto({ alt }: { alt: string }) {
  const widths = [480, 800, 1200];
  const sizes = "(max-width: 767px) calc(100vw - 48px), 46vw";
  return (
    <figure className="hero-photo">
      <picture>
        <source type="image/avif" srcSet={widths.map(w => `/images/tokyo-${w}.avif ${w}w`).join(", ")} sizes={sizes} />
        <source type="image/webp" srcSet={widths.map(w => `/images/tokyo-${w}.webp ${w}w`).join(", ")} sizes={sizes} />
        <img src="/images/tokyo-1200.jpg" alt={alt} width="1200" height="799" fetchPriority="high" decoding="async" />
      </picture>
      <figcaption>Tokyo, Japan</figcaption>
    </figure>
  );
}
