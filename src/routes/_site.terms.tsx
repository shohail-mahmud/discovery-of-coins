import { createFileRoute } from "@tanstack/react-router";
import { TermsPage } from "@/pages_src/TermsPage";

export const Route = createFileRoute("/_site/terms")({
  component: TermsPage,
});
