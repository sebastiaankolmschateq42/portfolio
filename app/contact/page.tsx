import ContactForm from "@/app/components/ContactForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact page to get in touch with Sebastiaan Henri Kolmschate",
};

export default function ContactPage() {
  return (
    <div>
      <h1>Contact</h1>
      <p className="mb-4">
        Send me a message and I will reply by email. Your details are only used to answer you.
      </p>
      <ContactForm />
    </div>
  );
}
