import { z } from "zod";

const NavItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const SiteSchema = z.object({
  title: z.string().min(1),
  nav: z.array(NavItemSchema).min(1),
});

export type Site = z.infer<typeof SiteSchema>;
export type NavItem = z.infer<typeof NavItemSchema>;
