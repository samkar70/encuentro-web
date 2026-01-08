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
  title: "Encuentro | Karla Perdomo",
  description: "Tablero de Control Espiritual",
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