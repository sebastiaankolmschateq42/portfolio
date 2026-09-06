import { z } from "zod";

const ProjectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  date: z.coerce.date(),
  summary: z.string().min(1),
  description: z.array(z.string().min(1)),
  images: z.array(z.object({ src: z.string().min(1), alt: z.string().min(1) })),
});

const PortfolioSchema = z.object({
  bio: z.string().min(1),
  skills: z.array(z.string().min(1)).min(1),
  projects: z.array(ProjectSchema).min(1),
});

const rawPortfolio = {
  bio: "Sebastiaan Henri Kolmschate (Bsc) is an artist from Amersfoort, The Netherlands. With a background of organising, digital and physical products he pursues projects driven by passion and purpose.",
  skills: [
    "Entrepreneurship",
    "Typescript",
    "Python",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Git",
    "GitHub",
    "Docker",
    "Linux",
    "Google Cloud Platform",
    "Jupyter Notebook",
    "AI-development",
    "Machine Learning",
    "Data Science",
    "DevOps",
    "MLops",
    "Figma",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Adobe Premiere Pro",
  ],
  projects: [
    {
      slug: "perfecte-coffeemug",
      title: "Perfect Coffee Mug",
      date: new Date("2021-01-01"),
      summary: "Perfect Coffee Mug",
      description: [
        "Perfect Coffee Mug was my first introduction project in my first year of university. Using a tempature sensor and a light we build a coffee mug that will turn on when the coffee is ready to be drunk.",
      ],
      images: [{ src: "https://via.placeholder.com/150", alt: "Perfect Coffee Mug image" }],
    },
    {
      slug: "msv-salz-geluidsmonitor",
      title: "MSV Salz Geluidsmonitor",
      date: new Date("2021-01-06"),
      summary: "MSV Salz Geluidsmonitor",
      description: [
        "MSV Salz Geluidsmonitor was a project I did for the Web Development course at my university. We built a website that would monitor the noise level of the MSV Salz and would alert the club when the noise level of a certain rider was too high.",
      ],
      images: [{ src: "https://via.placeholder.com/150", alt: "MSV Salz Geluidsmonitor image" }],
    },
    {
      slug: "mainpanel",
      title: "Main Panel",
      date: new Date("2024-01-27"),
      summary: "Mainpanel",
      description: ["Mainpanel"],
      images: [{ src: "https://via.placeholder.com/150", alt: "Mainpanel image" }],
    },
    {
      slug: "clubpaap",
      title: "Club Paap",
      date: new Date("2025-08-11"),
      summary:
        "Club Paap is a night club experiment in Amersfoort which he created in collaboration with a close group of friends. He was the main organizer of the organisation and responsible for the (artistic) vision, management, marketing and execution of the club.",
      description: ["Club Paap"],
      images: [{ src: "https://via.placeholder.com/150", alt: "Club Paap image" }],
    },
    {
      slug: "voyage-spiritual",
      title: "Voyage Spiritual",
      date: new Date("2024-05-3"),
      summary:
        "Voyage Spiritual is a mockumentary created for the Film festival in Alba La Romaine in France. It is a story about a young professional travelling to the Ardeche to find himself with the help of lady sunshine. He was responsible for part of the production, filming, editing and acting in the film.",
      description: ["Voyage Spiritual the movie was amazing!!!! It was a great experience to be part of the film and to work with the team.", "A bit more temporary test stuff."],
      images: [{ src: "https://via.placeholder.com/150", alt: "Voyage Spiritual the movie image" }],
    },
    {
      slug: "platformvoorsucces",
      title: "Platform Voor Succes (PVS)",
      date: new Date("2025-01-04"),
      summary: "Platform Voor Succes",
      description: ["Platform Voor Succes"],
      images: [{ src: "https://via.placeholder.com/150", alt: "Platform Voor Succes image" }],
    },
    {
      slug: "rijksmuseum-visual-search",
      title: "Rijksmuseum Visual Search",
      date: new Date("2025-01-01"),
      summary: "Rijksmuseum Visual Search",
      description: ["Rijksmuseum Visual Search"],
      images: [{ src: "https://via.placeholder.com/150", alt: "Rijksmuseum Visual Search image" }],
    },
    {
      slug: "kohese",
      title: "Kohese",
      date: new Date("2024-01-01"),
      summary: "Kohese is mijn muzikale ontdekking",
      description: ["Kohese is mijn muzikale ontdekking"],
      images: [{ src: "https://via.placeholder.com/150", alt: "Platform Voor Succes image" }],
    },
  ],
};

export const portfolio = PortfolioSchema.parse(rawPortfolio);
export type Project = z.infer<typeof ProjectSchema>;
