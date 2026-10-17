import { portfolio } from "@/lib/content";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const projecten = [...portfolio.projects].sort((a, b) => b.date.getTime() - a.date.getTime());
  const education = [...portfolio.education].sort((a, b) => b.startYear - a.startYear);
  const { personalia } = portfolio;

  return (
    <div className="flex flex-col gap-8 mb-8">
      {/* Profile */}
      <section className="flex flex-col items-center gap-3 text-center">
        <Image
          src={portfolio.photo.src}
          alt={portfolio.photo.alt}
          width={160}
          height={160}
          priority
          className="size-40 rounded-full object-cover"
        />
        <h1 className="text-2xl font-semibold">{portfolio.name}</h1>
      </section>

      {/* Bio */}
      <section>
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

      <section aria-labelledby="personalia-heading" className="flex flex-col gap-4">
        <h2 id="personalia-heading" className="font-semibold border-b">
          Personal details
        </h2>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
          <dt>Email</dt>
          <dd>
            <a className="underline" href={`mailto:${personalia.email}`}>
              {personalia.email}
            </a>
          </dd>
          <dt>Phone</dt>
          <dd>
            <a className="underline" href={`tel:${personalia.phone.replaceAll(" ", "")}`}>
              {personalia.phone}
            </a>
          </dd>
          <dt>City</dt>
          <dd>{personalia.city}</dd>
          <dt>LinkedIn</dt>
          <dd>
            <a
              className="underline"
              href={personalia.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              {personalia.linkedin.replace(/^https:\/\/(www\.)?/, "")}
            </a>
          </dd>
        </dl>
      </section>
    </div>
  );
}
