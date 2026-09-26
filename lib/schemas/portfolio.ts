import { z } from "zod";

const LinkSchema = z.object({
  url: z.string().min(1),
  label: z.string().min(1),
});

export const ProjectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  date: z.coerce.date(),
  summary: z.string().min(1),
  description: z.array(z.string().min(1)),
  images: z.array(
    z.object({
      src: z.string().min(1),
      alt: z.string().min(1),
      link: z.string().min(1).optional(),
    }),
  ),
  links: z.array(LinkSchema).optional(),
});

export const PortfolioSchema = z.object({
  bio: z.string().min(1),
  skills: z.array(z.string().min(1)).min(1),
  projects: z.array(ProjectSchema).min(1),
});

export type Project = z.infer<typeof ProjectSchema>;
export type Portfolio = z.infer<typeof PortfolioSchema>;
