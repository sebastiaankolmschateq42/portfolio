import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";

const garamond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sebastiaan Henri Kolmschate",
  description:
    "Sebastiaan Henri Kolmschate (Bsc) is an artist from Amersfoort, The Netherlands. With a background of organising, digital and physical products he persuits projects driven by passion and purpose.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${garamond.className} h-full antialiased text-lg`}>
      <body className="min-h-full flex flex-col max-w-2xl mx-auto px-4 gap-4">
        <header>
          <Navigation />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
