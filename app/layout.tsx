import type { Metadata } from "next";
import { Averia_Serif_Libre } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";

const averiaSerifLibre = Averia_Serif_Libre({
  variable: "--font-averia-serif-libre",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
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
    <html
      lang="en"
      className={`${averiaSerifLibre.variable} h-full antialiased text-lg font-italic`}
    >
      <body className="min-h-full flex flex-col max-w-2xl mx-auto px-4 gap-4">
        <header>
          <Navigation />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
