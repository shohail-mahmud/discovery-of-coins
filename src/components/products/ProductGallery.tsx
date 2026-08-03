import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductImage } from './ProductImage';

interface ProductGalleryProps {
  productName: string;
  images?: string[];
}

export function ProductGallery({ productName, images = [] }: ProductGalleryProps) {
  const slides = images.length > 0 ? images : [undefined];
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [images.join('|')]);

  const safeIndex = Math.min(selectedIndex, slides.length - 1);
  const active = slides[safeIndex];
  const hasMultiple = slides.length > 1;

  const go = (delta: number) =>
    setSelectedIndex((current) => {
      const next = (current + delta + slides.length) % slides.length;
      return next;
    });

  return (
    <div className="space-y-4">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden border border-ink/10 bg-paper">
        <ProductImage
          key={active ?? `placeholder-${safeIndex}`}
          path={active}
          alt={`${productName} — image ${safeIndex + 1}`}
          iconSize={40}
          label={`${productName} — View ${safeIndex + 1}`}
        />

        {hasMultiple ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 border border-ink/15 bg-paper/90 p-2 text-ink transition-colors hover:bg-ink hover:text-brand"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 border border-ink/15 bg-paper/90 p-2 text-ink transition-colors hover:bg-ink hover:text-brand"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
            <p className="absolute bottom-2 right-2 bg-ink/80 px-2 py-1 font-sans text-[10px] uppercase tracking-widest text-brand">
              {safeIndex + 1} / {slides.length}
            </p>
          </>
        ) : null}
      </div>

      {hasMultiple ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {slides.map((path, index) => (
            <button
              key={`${path ?? 'placeholder'}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`flex aspect-square w-20 flex-shrink-0 items-center justify-center overflow-hidden border bg-paper transition-colors duration-200 ${
                safeIndex === index
                  ? 'border-ink/40'
                  : 'border-ink/10 hover:border-ink/30'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <ProductImage path={path} alt={`${productName} thumbnail ${index + 1}`} iconSize={18} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
