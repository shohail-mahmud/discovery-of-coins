import { createFileRoute } from "@tanstack/react-router";
import { ComboPage } from "@/pages_src/ComboPage";

export const Route = createFileRoute("/_site/combo")({
  component: ComboPage,
});
