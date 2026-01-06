import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Encuentro | Karla Perdomo',
    short_name: 'Encuentro',
    description: 'Reflexiones diarias y una palabra para tu corazón.',
    start_url: '/',
    display: 'standalone', // Esto hace que se abra sin barras de navegador
    background_color: '#020617', // Color de fondo de carga (Slate-950 de tu diseño)
    theme_color: '#f59e0b', // Color de la barra de estado del celular (Amber-500)
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}