import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/pages_src/ContactPage";

export const Route = createFileRoute("/_site/contact")({
  component: ContactPage,
});
