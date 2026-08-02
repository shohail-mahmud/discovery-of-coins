import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/pages_src/AboutPage";

export const Route = createFileRoute("/_site/about")({
  component: AboutPage,
});
