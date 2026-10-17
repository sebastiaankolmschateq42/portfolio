import { portfolio } from "@/lib/content";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const projecten = [...portfolio.projects].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="flex flex-col gap-8 mb-4">
      {/* Bio */}
      <section className="flex flex-row gap-4">
        <h2 className="sr-only">{portfolio.name}</h2>
        <Image src={portfolio.photo.src} alt={portfolio.photo.alt} width={100} height={100} />
        <p>{portfolio.bio}</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold">Projects</h2>
        <ul className="flex flex-col space-y-2">
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
      <section>
        <h2>Education</h2>
        <ul className="flex flex-col space-y-2">
          {portfolio.education.map((education) => (
            <li key={education.degree} className="flex flex-col">
              <h3 className="font-semibold">{education.degree}</h3>
              <div className="flex flex-row gap-2">
                <p>
                  {education.institution}, {education.city}
                </p>
                <p>
                  {education.startYear} - {education.endYear}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Skills</h2>
        <ul className="flex flex-wrap gap-2">
          {portfolio.skills.map((skill) => (
            <li key={skill}>
              <p className="italic">{skill}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
