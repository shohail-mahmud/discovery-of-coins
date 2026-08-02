import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/pages_src/ProductPage";

export const Route = createFileRoute("/_site/product/$id")({
  component: ProductPage,
});
