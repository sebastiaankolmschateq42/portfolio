import { z } from "zod";

const ProjectSchema = z.object({
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
  website: z.string().min(1).optional(),
  link: z.string().min(1).optional(),
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
      summary: "A mug that prevents you from burning your mouth when you drink hot coffee.",
      description: [
        "Perfect Coffee Mug was my first introduction project in my first year of university. Using a temperature sensor and a light we built a coffee mug that will turn on when the coffee is ready to be drunk.",
      ],
      images: [],
    },
    {
      slug: "msv-salz-geluidsmonitor",
      title: "MSV Salz Geluidsmonitor",
      date: new Date("2021-01-06"),
      summary:
        "A website that monitors the noise level of individual motocross riders and alerts the club when a rider is too loud.",
      description: [
        "MSV Salz Geluidsmonitor was a project I did for the Web Development course at my university. We built a website that would monitor the noise level of the motocross club MSV Salz and would alert the club when the noise level of a certain rider was too high.",
      ],
      images: [{ src: "/img/msv-salz.png", alt: "MSV Salz Geluidsmonitor image" }],
    },
    {
      slug: "mainpanel",
      title: "Main Panel",
      date: new Date("2024-01-27"),
      summary:
        "Mainpanel is an underground techno collective in Amersfoort pushing the limits of the local techno scene.",
      description: [
        "Mainpanel is a collective I've started in 2024 with a few friends. We've organized 10+ events in the local techno scene with a highlight of hosting a small stage at Into The Woods festival in Amersfoort in 2025.",
      ],
      images: [
        { src: "/img/main-panel.jpeg", alt: "Mainpanel event" },
        { src: "/img/itw.jpeg", alt: "Mainpanel stage at Into The Woods festival" },
      ],
      website: "https://mainpanel.nl",
    },
    {
      slug: "clubpaap",
      title: "Club Paap",
      date: new Date("2025-08-11"),
      summary:
        "Club Paap unites night collectives from Amersfoort and tries to create a scene where there is none yet.",
      description: [
        "A mission to enlarge club culture in Amersfoort. By not operating on an island, but by uniting multiple smaller groups who have the same mission: create a space where people can be safe and enjoy electronic music. Which is disappearing in the current nightlife. I have arranged a temporary venue where these groups and those target groups can come together. Which has grown to our largest event with 700+ visitors. With along the way setting up and managing the organisation's structure, strategy, marketing, finances, artists, logistics and volunteers. All done with a small group of friends who have a shared passion for the scene.",
      ],
      images: [{ src: "/img/club-paap.jpeg", alt: "Club Paap event with visitors" }],
      website: "https://clubpaap.nl",
    },
    {
      slug: "voyage-spiritual",
      title: "Voyage Spiritual",
      date: new Date("2024-05-03"),
      summary:
        "A mockumentary about a young professional travelling to the Ardeche to find himself with the help of lady sunshine.",
      description: [
        "Voyage Spiritual is a mockumentary created for the Film festival in Alba La Romaine in France. It is a story about a young professional travelling to the Ardeche to find himself with the help of lady sunshine. I was responsible for part of the production, filming, editing and acting in the film.",
      ],
      images: [{ src: "/img/voyage-spiritual.png", alt: "Still from Voyage Spiritual" }],
    },
    {
      slug: "rijksmuseum-visual-search",
      title: "Rijksmuseum Visual Search",
      date: new Date("2025-01-01"),
      summary: "A visual search engine for the Rijksmuseum.",
      description: [
        "My graduation project I did at Windesheim and Q42. A visual search engine for the Rijksmuseum. It allows you to search for artworks by their visual features, such as color, texture, and composition. Now in 2026 it is actually live and implemented in the Rijksmuseum's Collection Online, for which I have also helped with the final steps along the way.",
      ],
      images: [
        {
          src: "/img/visual-search-rijksmuseum.jpg",
          alt: "Rijksmuseum Visual Search interface",
        },
      ],
      website:
        "https://www.rijksmuseum.nl/nl/collectie/visueel/zoeken?objectNodeId=42dd0e658c2979aec8e144d2357c55c0",
      link: "https://engineering.q42.nl/visual-search/",
    },
    {
      slug: "kohese",
      title: "Kohese",
      date: new Date("2024-01-01"),
      summary: "Kohese is my musical discovery.",
      description: [
        "Kohese is my musical discovery. With the things I do for the clubbing and nightlife I also really fell in love with electronic music. I started to DJ in 2023 and since then I have been playing at multiple small clubs and festivals in the Netherlands.",
      ],
      images: [],
      website: "https://soundcloud.com/kohese",
    },
  ],
};

export const portfolio = PortfolioSchema.parse(rawPortfolio);
export type Project = z.infer<typeof ProjectSchema>;
