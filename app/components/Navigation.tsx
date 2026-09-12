import { site } from "@/lib/navigation";
import Link from "next/link";
import type { NavItem } from "@/lib/navigation";

export default function Navigation() {
  return (
    <nav className="flex flex-col justify-between items-center pt-8">
      <Link href="/" className="text-xl font-semibold">
        Sebastiaan Henri Kolmschate
      </Link>
      <div className="flex flex-row gap-2">
        {site.nav.map((item: NavItem) => (
          <Link className="underline" key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
