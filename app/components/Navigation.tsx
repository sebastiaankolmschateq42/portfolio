import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="flex flex-col justify-between items-left pt-8">
      <Link href="/" className="text-xl font-semibold">
        Sebastiaan Henri Kolmschate
      </Link>
      <ul className="flex flex-row gap-2">
        <li>
          <Link href="/contact">Contact</Link>
        </li>
        <li>
          <Link href="/guestbook">Guestbook</Link>
        </li>
      </ul>
    </nav>
  );
}
