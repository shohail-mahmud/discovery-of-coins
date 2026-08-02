import { createFileRoute } from "@tanstack/react-router";
import { CartProvider } from "@/context/CartContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/_site")({
  component: SiteLayout,
});

function SiteLayout() {
  return (
    <CartProvider>
      <ScrollToTop />
      <Layout />
    </CartProvider>
  );
}