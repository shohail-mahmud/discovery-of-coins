import { createFileRoute } from "@tanstack/react-router";
import { CartPage } from "@/pages_src/CartPage";

export const Route = createFileRoute("/_site/cart")({
  component: CartPage,
});
