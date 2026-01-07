import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

// Configuración de fuentes para mantener el estilo Serif/Sans de la marca
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  style: ["normal", "italic"] 
});

// 1. Exportación de Metadata (Sin Viewport)
export const metadata: Metadata = {
  title: "Encuentro | Karla Perdomo",
  description: "Tablero de Control Espiritual y Discipulado Bíblico",
  icons: {
    icon: "/favicon.ico", // Asegúrate de tener un favicon en /public
  },
};

// 2. Exportación de Viewport (Nueva forma correcta en Next.js)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`
          ${inter.variable} 
          ${playfair.variable} 
          antialiased 
          bg-[#020617] 
          selection:bg-amber-500/30
        `}
      >
        {children}
      </body>
    </html>
  );
}