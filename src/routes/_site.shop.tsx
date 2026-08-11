import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/pages_src/ShopPage";
import { canonicalUrl, OG_IMAGE, SITE_NAME, itemListSchema } from "@/lib/seo";

interface ProductRow {
  id: string;
  name: string;
  price: number | string;
}

// Server-side fetch of the product list (plain REST, works in any Node runtime)
// so the shop page can render an ItemList schema in the <head>.
async function fetchProductsSsr(): Promise<ProductRow[]> {
  try {
    const url = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const key =
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return [];
    const res = await fetch(
      `${url}/rest/v1/products?select=id,name,price&limit=100`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Accept: "application/json",
        },
      },
    );
    if (!res.ok) return [];
    return (await res.json()) as ProductRow[];
  } catch {
    return [];
  }
}

export const Route = createFileRoute("/_site/shop")({
  loader: async () => {
    const products = await fetchProductsSsr();
    return { products };
  },
  component: ShopPage,
  head: ({ loaderData }) => {
    const items = (loaderData?.products ?? []).map((p) => ({
      name: p.name,
      url: canonicalUrl(`/product/${p.id}`),
    }));

    return {
      meta: [
        { title: `Shop Coins, Banknotes & Stamps | ${SITE_NAME}` },
        {
          name: "description",
          content:
            "Shop authentic collectible coins, banknotes and stamps — Bangladeshi and foreign. Browse rare banknotes, vintage coins and stamps, sorted by category, with delivery across Bangladesh.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonicalUrl("/shop") },
        {
          property: "og:title",
          content: `Shop Coins, Banknotes & Stamps | ${SITE_NAME}`,
        },
        {
          property: "og:description",
          content:
            "Browse and buy authentic collectible coins, banknotes and stamps — Bangladeshi and foreign.",
        },
        { property: "og:image", content: OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: canonicalUrl("/shop") }],
      scripts: items.length
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify(itemListSchema(items)),
            },
          ]
        : [],
    };
  },
});
