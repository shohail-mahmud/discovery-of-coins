import { createFileRoute } from "@tanstack/react-router";
import { OrderSuccessPage } from "@/pages_src/OrderSuccessPage";

export const Route = createFileRoute("/_site/order-success")({
  component: OrderSuccessPage,
  head: () => ({
    meta: [
      { title: "Order Confirmed | Discovery of Coins" },
      {
        name: "description",
        content:
          "Your order has been placed with Discovery of Coins. Our team will contact you shortly to confirm the details.",
      },
      { property: "og:title", content: "Order Confirmed | Discovery of Coins" },
      {
        property: "og:description",
        content:
          "Your order has been placed with Discovery of Coins. Our team will contact you shortly to confirm the details.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
