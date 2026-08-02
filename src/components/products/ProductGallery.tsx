import { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface ProductGalleryProps {
  productName: string;
}

export function ProductGallery({ productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const thumbnails = [0, 1, 2];

  return (
    <div className="space-y-4">
      <div className="flex aspect-square items-center justify-center border border-ink/10 bg-paper">
        <div className="flex flex-col items-center gap-3 text-ink/30">
          <ImageIcon size={40} strokeWidth={1.5} />
          <span className="font-sans text-xs uppercase tracking-widest">
            {productName} — View {selectedIndex + 1}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        {thumbnails.map((index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className={`flex aspect-square w-20 items-center justify-center border bg-paper transition-colors duration-200 ${
              selectedIndex === index
                ? 'border-ink/40'
                : 'border-ink/10 hover:border-ink/30'
            }`}
            aria-label={`View image ${index + 1}`}
          >
            <ImageIcon size={18} strokeWidth={1.5} className="text-ink/30" />
          </button>
        ))}
      </div>
    </div>
  );
}
