import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ENCUENTRO | Karla Perdomo",
  description: "Un espacio de fe y esperanza. Entrevistas y mensajes que transforman el corazón.",
  openGraph: {
    title: "ENCUENTRO con Karla Perdomo",
    description: "🎙️ Mensajes de bendición y entrevistas con propósito.",
    url: "https://encuentro-web.vercel.app",
    siteName: "Encuentro",
    images: [{ url: "/logo-encuentro.png" }],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}