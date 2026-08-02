import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/store';

export function useProducts() {
  return useQuery({ queryKey: ['products'], queryFn: fetchProducts });
}

export function useProduct(id: string | undefined) {
  const { data, ...rest } = useProducts();
  return {
    ...rest,
    data: id ? data?.find((product) => product.id === id) : undefined,
    products: data ?? [],
  };
}
