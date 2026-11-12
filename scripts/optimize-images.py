"""Pre-render the hero photo as grayscale responsive AVIF/WebP/JPEG variants.

Source: public/images/tokyo.jpg (Unsplash, provenance in docs/customer-credibility-redesign.md).
Matches the previous CSS `filter: grayscale(100%) contrast(.9)` so the look is unchanged.
Requires Pillow with AVIF support (Pillow >= 11.2). Run: python3 scripts/optimize-images.py
"""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1] / "public" / "images"
src = Image.open(root / "tokyo.jpg").convert("L").point(lambda v: round((v - 128) * 0.9 + 128))
for width in (480, 800, 1200):
    height = round(src.height * width / src.width)
    img = src.resize((width, height), Image.LANCZOS)
    img.save(root / f"tokyo-{width}.avif", quality=55)
    img.save(root / f"tokyo-{width}.webp", quality=72, method=6)
    if width == 1200:
        img.save(root / f"tokyo-{width}.jpg", quality=78, optimize=True, progressive=True)
for f in sorted(root.glob("tokyo*")):
    print(f.name, f.stat().st_size)
