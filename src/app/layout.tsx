import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "ENCUENTRO | Karla Perdomo",
  description: "Mensajes de fe y esperanza.",
  openGraph: {
    images: ["/logo-encuentro.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased bg-slate-950">
        {children}
        <Analytics />
      </body>
    </html>
  );
}