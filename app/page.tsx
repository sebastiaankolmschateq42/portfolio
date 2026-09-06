import { portfolio } from "@/lib/content";
import Link from "next/link";

export default function Home() {
  const projecten = [...portfolio.projects].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="flex flex-col gap-4">
      {/* Bio */}
      <section>
        <p>{portfolio.bio}</p>
      </section>
      <section>
        <ul className="flex flex-col gap-2">
          {projecten.map((project) => (
            <div key={project.slug}>
              <Link href={`/projects/${project.slug}`}>
                <h3 className="font-semibold">{project.title}</h3>
              </Link>
              <p>{project.summary}</p>
            </div>
          ))}
        </ul>
      </section>
    </div>
  );
}
