import { portfolio } from "@/lib/content";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const projecten = [...portfolio.projects].sort((a, b) => b.date.getTime() - a.date.getTime());
  const education = [...portfolio.education].sort((a, b) => b.startYear - a.startYear);

  return (
    <div className="flex flex-col gap-8 mb-8">
      {/* About me: photo left, introduction right */}
      <section className="flex flex-row items-start gap-4">
        <h1 className="sr-only">{portfolio.name}</h1>
        <Image
          src={portfolio.photo.src}
          alt={portfolio.photo.alt}
          width={100}
          height={100}
          priority
          className="shrink-0 object-cover"
        />
        <p>{portfolio.bio}</p>
      </section>

      <section aria-labelledby="projects-heading" className="flex flex-col gap-4">
        <h2 id="projects-heading" className="font-semibold border-b">
          Projects
        </h2>
        <ul className="flex flex-col gap-4">
          {projecten.map((project) => (
            <li key={project.slug}>
              <Link href={`/projects/${project.slug}`}>
                <h3 className="font-semibold underline">{project.title}</h3>
                <p>{project.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="skills-heading" className="flex flex-col gap-4">
        <h2 id="skills-heading" className="font-semibold border-b">
          Skills
        </h2>
        <ul className="flex flex-wrap gap-2">
          {portfolio.skills.map((skill) => (
            <li key={skill} className="border rounded-full px-3 text-base">
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="education-heading" className="flex flex-col gap-4">
        <h2 id="education-heading" className="font-semibold border-b">
          Education
        </h2>
        <ul className="flex flex-col gap-3">
          {education.map((item) => (
            <li key={item.degree}>
              <h3>{item.degree}</h3>
              <p className="text-base">
                {item.institution}, {item.city} · {item.startYear}–{item.endYear}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
