import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // Corregimos el aviso de Next.js
  metadataBase: new URL('http://localhost:3000'),
  title: "Encuentro | Karla Perdomo",
  description: "Un encuentro con la verdad y la palabra",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-950 antialiased`}>
        {children}
      </body>
    </html>
  );
}