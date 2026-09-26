import { z } from "zod";

const NavItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const SiteSchema = z.object({
  title: z.string().min(1),
  nav: z.array(NavItemSchema).min(1),
});

const rawSite = {
  title: "Sebastiaan Henri Kolmschate",
  nav: [
    { label: "Contact", href: "/contact" },
    { label: "Guestbook", href: "/guestbook" },
  ],
};

export const site = SiteSchema.parse(rawSite);
export type Site = z.infer<typeof SiteSchema>;
export type NavItem = z.infer<typeof NavItemSchema>;
