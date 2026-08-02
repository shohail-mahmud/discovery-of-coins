import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/pages_src/HomePage";

export const Route = createFileRoute("/_site/")({
  component: HomePage,
});
