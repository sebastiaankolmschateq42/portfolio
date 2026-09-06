import { portfolio } from "@/lib/content";
import { notFound } from "next/navigation";
import Image from "next/image";

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
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <p>{project?.summary}</p>
      </section>
      <section>
          {project?.images.map((image) => (
            <Image key={image.src}
              src={"/placeholder.jpg"}
              alt={image.alt}
              width={100}
              height={100}
            />
          ))}
      </section>
      <section className="flex flex-col gap-2">
        {
          project?.description.map((description) => (
            <p key={description}>{description}</p>
          ))
        }
      </section>
    </div>
  );
}
