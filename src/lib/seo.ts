// SEO helpers — canonical URLs and structured data for Discovery of Coins.
// The live site redirects both the apex domain and http to:
//   https://www.discoveryofcoins.store/
export const SITE_URL = "https://www.discoveryofcoins.store";
export const SITE_NAME = "Discovery of Coins";
export const SITE_TAGLINE =
  "Authentic collectible coins, banknotes and stamps from Bangladesh and around the world.";
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export function canonicalUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p === "/" ? "/" : p}`;
}

export function orgSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    sameAs: [
      "https://instagram.com/discoveryofcoins",
      "https://facebook.com/discoveryofbanknotes",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+8801977278788",
      contactType: "customer service",
    },
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export interface ProductSchemaInput {
  name: string;
  description: string;
  image?: string | null;
  price: number;
  inStock: boolean;
  category?: string;
  sku?: string;
}

export function productSchema(product: ProductSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || SITE_TAGLINE,
    image: product.image ? [product.image] : undefined,
    sku: product.sku,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: product.category,
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: undefined as string | undefined,
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };
}

export function faqSchema(
  faqs: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
