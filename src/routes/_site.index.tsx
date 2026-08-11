import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/pages_src/HomePage";
import { SITE_URL, SITE_NAME, OG_IMAGE } from "@/lib/seo";

export const Route = createFileRoute("/_site/")({
  component: HomePage,
  head: () => ({
    meta: [
      {
        title: `${SITE_NAME} — Authentic Coins, Banknotes & Stamps`,
      },
      {
        name: "description",
        content:
          "Discovery of Coins — buy authentic collectible coins, banknotes and stamps from Bangladesh and around the world. Rare collectibles delivered across Bangladesh.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      {
        property: "og:title",
        content: `${SITE_NAME} — Authentic Coins, Banknotes & Stamps`,
      },
      {
        property: "og:description",
        content:
          "Buy authentic collectible coins, banknotes and stamps from Bangladesh and around the world.",
      },
      { property: "og:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
});
