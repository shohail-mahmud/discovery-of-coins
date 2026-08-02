import { createFileRoute } from "@tanstack/react-router";
import { AdminLoginPage } from "@/pages_src/admin/AdminLoginPage";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Sign In | Discovery of Coins" },
      { name: "description", content: "Sign in to manage Discovery of Coins orders, products and contact details." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Sign In | Discovery of Coins" },
      { property: "og:description", content: "Sign in to manage Discovery of Coins orders, products and contact details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminLoginPage,
});
