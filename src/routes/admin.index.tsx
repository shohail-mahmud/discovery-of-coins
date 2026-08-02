import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminDashboard } from "@/pages_src/admin/AdminDashboard";
import { useAdmin } from "@/hooks/useAdmin";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Discovery of Coins" },
      { name: "description", content: "Manage orders, products, images and contact details for Discovery of Coins." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Dashboard | Discovery of Coins" },
      { property: "og:description", content: "Manage orders, products, images and contact details for Discovery of Coins." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminRoute,
});

function AdminRoute() {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      void navigate({ to: "/admin/login", replace: true });
    }
  }, [loading, isAdmin, navigate]);

  if (loading || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand">
        <p className="font-sans text-sm font-light text-ink/60">Checking access…</p>
      </div>
    );
  }

  return <AdminDashboard />;
}
