import { portfolio } from "@/lib/content";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const projecten = [...portfolio.projects].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="flex flex-col gap-8 mb-4">
      {/* Bio */}
      <section className="flex flex-row gap-4">
        <Image src={portfolio.photo.src} alt={portfolio.photo.alt} width={100} height={100} />
        <p>{portfolio.bio}</p>
      </section>
      <section>
        <h1 className="text-2xl font-bold">Projecten</h1>
        <li className="flex flex-col space-y-2">
          {projecten.map((project) => (
            <div key={project.slug}>
              <Link href={`/projects/${project.slug}`}>
                <h2 className="font-semibold underline">{project.title}</h2>
                <p>{project.summary}</p>
              </Link>
            </div>
          ))}
        </li>
      </section>
      <section>
        <h1>Opleidingen</h1>
        <li className="flex flex-col space-y-2">
          {portfolio.education.map((education) => (
            <div key={education.degree} className="flex flex-col">
              <h2 className="font-semibold">{education.degree}</h2>
              <div className="flex flex-row gap-2">
                <p>
                  {education.institution}, {education.city}
                </p>
                <p>
                  {education.startYear} - {education.endYear}
                </p>
              </div>
            </div>
          ))}
        </li>
      </section>
      <section>
        <h1>Skills</h1>
        <li className="flex flex-wrap gap-2">
          {portfolio.skills.map((skill) => (
            <div key={skill}>
              <p className="italic">{skill}</p>
            </div>
          ))}
        </li>
      </section>
    </div>
  );
}
