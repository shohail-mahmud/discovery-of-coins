import { createFileRoute } from "@tanstack/react-router";
import { OfferPage } from "@/pages_src/OfferPage";

export const Route = createFileRoute("/_site/offer")({
  component: OfferPage,
});
