import { useState } from 'react';
import { ProductImage } from './ProductImage';

interface ProductGalleryProps {
  productName: string;
  images?: string[];
}

export function ProductGallery({ productName, images = [] }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const thumbnails = images.length > 0 ? images : [undefined, undefined, undefined];
  const active = thumbnails[selectedIndex];

  return (
    <div className="space-y-4">
      <div className="flex aspect-square items-center justify-center overflow-hidden border border-ink/10 bg-paper">
        <ProductImage
          path={active}
          alt={productName}
          iconSize={40}
          label={`${productName} — View ${selectedIndex + 1}`}
        />
      </div>

      <div className="flex gap-3">
        {thumbnails.map((path, index) => (
          <button
            key={`${path ?? 'placeholder'}-${index}`}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className={`flex aspect-square w-20 items-center justify-center overflow-hidden border bg-paper transition-colors duration-200 ${
              selectedIndex === index
                ? 'border-ink/40'
                : 'border-ink/10 hover:border-ink/30'
            }`}
            aria-label={`View image ${index + 1}`}
          >
            <ProductImage path={path} alt={productName} iconSize={18} />
          </button>
        ))}
      </div>
    </div>
  );
}
