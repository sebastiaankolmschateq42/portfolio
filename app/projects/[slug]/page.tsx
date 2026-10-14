import { portfolio } from "@/lib/content";
import { notFound } from "next/navigation";
import Image from "next/image";

export function generateStaticParams() {
  return portfolio.projects.map((project) => ({ slug: project.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const paramsData = await params;
  const { slug } = paramsData;
  const project = portfolio.projects.find((project) => project.slug == slug) ?? null;

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <section>
        <div className="flex flex-col">
          <h1 className="font-bold">{project.title}</h1>
          <p>{project?.summary}</p>
        </div>
        <div className="flex flex-row gap-4">
          {project?.links?.map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
              <p className="underline">{link.label}</p>
            </a>
          ))}
        </div>
      </section>
      <section>
        {project?.images.map((image) => (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            width={1000}
            height={1000}
            className="w-full h-auto"
          />
        ))}
      </section>
      <section className="flex flex-col gap-2">
        {project?.description.map((description) => (
          <p key={description}>{description}</p>
        ))}
      </section>
    </div>
  );
}
