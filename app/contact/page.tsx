import ContactForm from "@/app/components/ContactForm";
import { createCaptcha } from "@/lib/captcha";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact page to get in touch with Sebastiaan Henri Kolmschate",
};

export const dynamic = "force-dynamic";

export default function ContactPage() {
  const captcha = createCaptcha();

  return (
    <div>
      <h1 className="mb-2">Contact</h1>
      <p className="mb-4">
        Send me a message and I will reply by email. Your details are only used to answer you.
      </p>
      <ContactForm initialCaptcha={captcha} />
    </div>
  );
}
