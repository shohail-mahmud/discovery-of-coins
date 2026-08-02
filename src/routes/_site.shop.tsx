import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/pages_src/ShopPage";

export const Route = createFileRoute("/_site/shop")({
  component: ShopPage,
});
