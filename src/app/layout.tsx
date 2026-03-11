import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer"; // Importamos el Footer

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair" 
});

export const metadata: Metadata = {
  title: "Encuentro | Karla Perdomo — Palabra y Vida",
  description: "Un espacio de crecimiento espiritual con Karla Perdomo. Reflexiones bíblicas diarias, radio en vivo, videos inspiradores y herramientas para tu fe.",
  keywords: ["Karla Perdomo", "devocional cristiano", "radio cristiana", "Palabra y Vida", "reflexión bíblica"],
  openGraph: {
    title: "Encuentro | Karla Perdomo",
    description: "Reflexiones bíblicas diarias y radio cristiana en vivo.",
    locale: "es_ES",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

// Aquí es donde corregimos el error definiendo el tipo de React.ReactNode
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        {/* Pre-conexión al servidor de streaming para reducir latencia del audio */}
        <link rel="preconnect" href="https://stream.zeno.fm" />
        <link rel="dns-prefetch" href="https://stream.zeno.fm" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-[#020617] text-slate-200`}
      >
        {children}
        
        {/* Agregamos el Footer aquí para que aparezca en toda la web */}
        <Footer />
      </body>
    </html>
  );
}