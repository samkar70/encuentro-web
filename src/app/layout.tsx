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
  keywords: ["Karla Perdomo", "Encuentro", "Podcast Cristiano", "Fe", "Esperanza", "Honduras"],
  authors: [{ name: "Karla Perdomo" }],
  openGraph: {
    title: "ENCUENTRO con Karla Perdomo",
    description: "🎙️ Mensajes de bendición y entrevistas con propósito.",
    url: "https://encuentro-web.vercel.app",
    siteName: "Encuentro",
    images: [
      {
        url: "/logo-encuentro.png", // Usando el logo del atardecer que elegiste
        width: 1200,
        height: 630,
        alt: "Encuentro con Karla Perdomo",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ENCUENTRO | Karla Perdomo",
    description: "Espacio de fe y esperanza.",
    images: ["/logo-encuentro.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}