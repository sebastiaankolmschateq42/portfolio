import type { Metadata } from "next";
import GuestbookForm from "@/app/components/GuestbookForm";
import { getApprovedGuestbookMessages } from "@/lib/guestbook";

export const metadata: Metadata = {
  title: "Guestbook",
  description: "Leave a message in the guestbook of Sebastiaan Henri Kolmschate",
};

// Messages change at runtime; without this the page would be frozen at build time.
export const dynamic = "force-dynamic";

export default async function GuestbookPage() {
  const messages = await getApprovedGuestbookMessages();

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h1>Guestbook</h1>
        <p>Leave a message. It will appear here once it has been approved.</p>
        <GuestbookForm />
      </section>

      <section className="flex flex-col gap-4">
        <h1>Messages</h1>
        {messages.length === 0 ? (
          <p>No messages yet. Be the first to sign the guestbook.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {messages.map((entry) => (
              <li key={entry.id}>
                <p className="whitespace-pre-line">{entry.message}</p>
                <p className="text-sm">
                  — {entry.name},{" "}
                  <time dateTime={entry.createdAt.toISOString()}>
                    {entry.createdAt.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
