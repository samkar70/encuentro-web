import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  keywords: ["Karla Perdomo", "Encuentro", "Podcast Cristiano", "Fe", "Esperanza"],
  openGraph: {
    title: "ENCUENTRO con Karla Perdomo",
    description: "🎙️ Mensajes de bendición y entrevistas con propósito.",
    url: "https://encuentro-web.vercel.app",
    siteName: "Encuentro",
    locale: "es_ES",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}