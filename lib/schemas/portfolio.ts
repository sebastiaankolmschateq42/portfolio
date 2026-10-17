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

export const EducationSchema = z
  .object({
    degree: z.string().min(1),
    institution: z.string().min(1),
    city: z.string().min(1),
    startYear: z.number().int(),
    endYear: z.number().int(),
  })
  .refine((education) => education.endYear >= education.startYear, {
    message: "endYear must not be before startYear",
  });

export const PersonaliaSchema = z.object({
  email: z.email(),
  phone: z.string().regex(/^\+?[0-9 ]{8,20}$/),
  city: z.string().min(1),
  linkedin: z.url(),
});

export const PortfolioSchema = z.object({
  name: z.string().min(1),
  personalia: PersonaliaSchema,
  photo: z.object({ src: z.string().min(1), alt: z.string().min(1) }),
  bio: z.string().min(1),
  skills: z.array(z.string().min(1)).min(1),
  education: z.array(EducationSchema).min(1),
  projects: z.array(ProjectSchema).min(1),
});

export type Project = z.infer<typeof ProjectSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Portfolio = z.infer<typeof PortfolioSchema>;
