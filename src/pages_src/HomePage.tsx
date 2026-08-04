import { Hero } from '../components/Hero';
import { CategoryGrid } from '../components/CategoryGrid';
import { FaqSection } from '../components/FaqSection';

export function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FaqSection />
    </>
  );
}
