import { useQuery } from '@tanstack/react-query';
import { ImageIcon } from 'lucide-react';
import { fetchImageUrl } from '@/lib/store';

interface ProductImageProps {
  path?: string | undefined;
  alt: string;
  className?: string;
  iconSize?: number;
  label?: string;
}

export function ProductImage({
  path,
  alt,
  className = '',
  iconSize = 24,
  label,
}: ProductImageProps) {
  const { data: url } = useQuery({
    queryKey: ['product-image', path],
    queryFn: () => fetchImageUrl(path as string),
    enabled: Boolean(path),
    staleTime: 1000 * 60 * 60,
  });

  if (path && url) {
    return (
      <img
        src={url}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 text-ink/30">
      <ImageIcon size={iconSize} strokeWidth={1.5} />
      {label ? (
        <span className="font-sans text-[10px] uppercase tracking-widest">{label}</span>
      ) : null}
    </div>
  );
}
