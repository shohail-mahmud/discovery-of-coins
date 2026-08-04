import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchCombos, fetchFaqs } from '@/lib/content';

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
}

export function useVisibleCategories() {
  const query = useCategories();
  return {
    ...query,
    data: (query.data ?? []).filter((category) => category.visible),
  };
}

export function useFaqs() {
  return useQuery({ queryKey: ['faqs'], queryFn: fetchFaqs });
}

export function useCombos() {
  return useQuery({ queryKey: ['combos'], queryFn: fetchCombos });
}
