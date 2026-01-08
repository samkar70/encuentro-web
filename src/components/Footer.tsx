'use client';

import { useRouter } from 'next/navigation';

export function Footer() {
  const router = useRouter();
  let clickCount = 0;

  // El "Huevo de Pascua" (Easter Egg) para Karla
  const handleSecretAccess = () => {
    clickCount++;
    if (clickCount === 3) { // Al tercer clic seguido...
      router.push('/admin/login');
      clickCount = 0;
    }
    // Reiniciar contador después de 2 segundos de inactividad
    setTimeout(() => { clickCount = 0; }, 2000);
  };

  return (
    <footer className="py-12 border-t border-white/5 text-center">
      <div 
        onClick={handleSecretAccess}
        className="cursor-default select-none opacity-20 hover:opacity-100 transition-opacity"
      >
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em]">
          © 2026 Encuentro • Karla Perdomo
        </p>
      </div>
      <p className="text-[9px] text-slate-700 mt-2 italic">
        Diseñado para el crecimiento del alma
      </p>
    </footer>
  );
}