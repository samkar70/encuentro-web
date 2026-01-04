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
});

export const metadata: Metadata = {
  title: "ENCUENTRO | Karla Perdomo",
  description: "Un espacio de fe y esperanza.",
  // CONFIGURACIÓN DE ICONO PARA EVITAR ERROR 404
  icons: {
    icon: "/logo-encuentro.png",
    apple: "/logo-encuentro.png",
  },
  openGraph: {
    title: "ENCUENTRO con Karla Perdomo",
    description: "🎙️ Mensajes de bendición.",
    images: [{ url: "/logo-encuentro.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}