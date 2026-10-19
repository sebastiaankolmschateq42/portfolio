import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import ConsentBanner from "./components/ConsentBanner";
import { portfolio } from "@/lib/content";

const garamond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sebastiaan Henri Kolmschate",
  description: portfolio.bio,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${garamond.className} h-full antialiased text-lg`}>
      <body className="min-h-full flex flex-col max-w-2xl mx-auto px-4 gap-8">
        <header>
          <Navigation />
        </header>
        <main>{children}</main>
        <ConsentBanner />
      </body>
    </html>
  );
}
