import { SiteSchema } from "@/lib/schemas/navigation";

const rawSite = {
  title: "Sebastiaan Henri Kolmschate",
  nav: [
    { label: "Contact", href: "/contact" },
    { label: "Guestbook", href: "/guestbook" },
  ],
};

export const site = SiteSchema.parse(rawSite);
export type { Site, NavItem } from "@/lib/schemas/navigation";
