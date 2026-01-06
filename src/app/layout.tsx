import './globals.css';
import { Inter, Libre_Caslon_Text } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const caslon = Libre_Caslon_Text({ 
  weight: ['400', '700'], 
  subsets: ['latin'], 
  style: ['italic', 'normal'],
  variable: '--font-caslon' 
});

export const metadata = {
  title: 'Encuentro | Karla Perdomo',
  description: 'Una palabra para tu corazón',
  // Esto es vital para móviles
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${caslon.variable}`}>
      <body className="bg-[#020617] antialiased selection:bg-amber-500/30">
        {children}
      </body>
    </html>
  );
}