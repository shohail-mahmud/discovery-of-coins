import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/pages_src/ProductPage";
import {
  canonicalUrl,
  OG_IMAGE,
  SITE_NAME,
  productSchema,
  breadcrumbSchema,
} from "@/lib/seo";

interface ProductRow {
  id: string;
  name: string;
  country: string;
  category: string;
  denomination: string;
  currency: string;
  year: string;
  condition: string;
  type: string;
  description: string;
  price: number | string;
  available: boolean;
  stock: number;
  images: string[];
}

// Server-side product fetch via plain REST (no Supabase client) so it works in
// any Node runtime during SSR, without initialising a realtime client.
async function fetchProductSsr(id: string): Promise<ProductRow | null> {
  try {
    const url = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const key =
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return null;
    const res = await fetch(
      `${url}/rest/v1/products?select=*&id=eq.${encodeURIComponent(id)}&limit=1`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Accept: "application/json",
        },
      },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as ProductRow[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/_site/product/$id")({
  // Load the product server-side (SSR) so the <head> can render a unique
  // title, description, canonical URL and Product schema per collectible.
  loader: async ({ params }) => {
    const product = await fetchProductSsr(params.id);
    return product
      ? {
          product: {
            id: product.id,
            name: product.name,
            country: product.country,
            type: product.type,
            condition: product.condition,
            year: product.year,
            currency: product.currency,
            category: product.category,
            description: product.description,
            price: Number(product.price),
            available: product.available,
            stock: product.stock,
          },
        }
      : null;
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product ?? null;
    const path = `/product/${p?.id ?? ""}`;
    const url = canonicalUrl(path);

    const title = p
      ? `${p.name} — ${p.country} ${p.type} | ${SITE_NAME}`
      : `Collectible | ${SITE_NAME}`;
    let description = `Shop authentic collectible coins, banknotes and stamps from ${SITE_NAME}.`;
    if (p) {
      const bits: string[] = [];
      if (p.condition) bits.push(`${p.condition} condition`);
      if (p.year) bits.push(p.year);
      if (p.currency) bits.push(p.currency);
      description = `${p.name} — Authentic ${p.type.toLowerCase()} from ${p.country}${
        bits.length ? `, ${bits.join(", ")}` : ""
      }. Price ৳${p.price}.`;
    }

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: p
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify(
                productSchema({
                  name: p.name,
                  description: p.description,
                  image: null,
                  price: p.price,
                  inStock: p.available && p.stock > 0,
                  category: p.category,
                  sku: p.id,
                  url,
                  condition: p.condition || undefined,
                }),
              ),
            },
            {
              type: "application/ld+json",
              children: JSON.stringify(
                breadcrumbSchema([
                  { name: "Home", url: canonicalUrl("/") },
                  { name: "Shop", url: canonicalUrl("/shop") },
                  { name: p.name, url },
                ]),
              ),
            },
          ]
        : [],
    };
  },
  component: ProductPage,
});
