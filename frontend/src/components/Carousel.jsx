import { useEffect, useState } from "react";

/* auto-import images */
const bwImports = import.meta.glob(
  "../assets/Carousel/Original/*.{png,jpg,jpeg,webp}",
  { eager: true }
);
const coloredImports = import.meta.glob(
  "../assets/Carousel/Colored/*.{png,jpg,jpeg,webp}",
  { eager: true }
);

function importsToArray(imports) {
  return Object.values(imports).map((m) => m.default);
}

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
  <rect width="100%" height="100%" fill="#1b1b2b"/>
  <text x="50%" y="50%" fill="#aaa" font-size="18"
    text-anchor="middle" dominant-baseline="middle">
    No image
  </text>
</svg>`);

export default function Carousel() {
  const bwImages = importsToArray(bwImports);
  const coloredImages = importsToArray(coloredImports);

  const maxSlides = Math.max(bwImages.length, coloredImages.length, 1);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (maxSlides <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % maxSlides);
    }, 4000);
    return () => clearInterval(t);
  }, [maxSlides]);

  return (
    <section className="comparisonCarousel">
      <h2 className="carouselTitle">Before & After</h2>

      <div className="carouselRow">
        <div className="carouselImageBlock">
          <span>Black & White</span>
          <img src={bwImages[index] || PLACEHOLDER} />
        </div>

        <div className="carouselImageBlock">
          <span>Colorized</span>
          <img src={coloredImages[index] || PLACEHOLDER} />
        </div>
      </div>

      <div className="carouselControls">
        <button onClick={() => setIndex((i) => (i === 0 ? maxSlides - 1 : i - 1))}>
          ◀
        </button>

        <span>{index + 1} / {maxSlides}</span>

        <button onClick={() => setIndex((i) => (i + 1) % maxSlides)}>
          ▶
        </button>
      </div>
    </section>
  );
}