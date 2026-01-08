'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Database, Book, Info, ListTree, Settings, 
  ShieldAlert, PlayCircle, LogOut, ChevronRight 
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  // 🛡️ PROTECCIÓN DE RUTA
  useEffect(() => {
    if (pathname !== '/admin/login') {
      const auth = sessionStorage.getItem('admin_auth');
      if (!auth) {
        router.push('/admin/login');
      } else {
        setAuthorized(true);
      }
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  if (!authorized && pathname !== '/admin/login') {
    return <div className="min-h-screen bg-[#020617]" />;
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // 📋 MENÚ BASADO EN TU ESTRUCTURA PDF
  const menu = [
    { name: 'Libros Base', path: 'Libro', icon: <Book size={18}/> },
    { name: 'Info Libros', path: 'info_libros', icon: <Info size={18}/> },
    { name: 'Salmos Master', path: 'salmos_master', icon: <Database size={18}/> },
    { name: 'Discipulado', path: 'Discipleship', icon: <ListTree size={18}/> },
    { name: 'Configuración', path: 'encuentro_setup', icon: <ShieldAlert size={18}/> },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    router.push('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans">
      <aside className="w-72 border-r border-white/5 p-8 flex flex-col bg-black/40 backdrop-blur-xl sticky top-0 h-screen">
        <div className="flex items-center gap-3 text-amber-500 font-serif italic text-2xl mb-12 px-2">
          <Settings className="animate-[spin_10s_linear_infinite]" size={24} /> 
          <span>Encuentro</span>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {menu.map((item) => {
            const isActive = pathname === `/admin/${item.path}`;
            return (
              <Link key={item.path} href={`/admin/${item.path}`} className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${isActive ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' : 'hover:bg-white/5 text-slate-400'}`}>
                <div className="flex items-center gap-4">
                  {item.icon}
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
          <button onClick={handleLogout} className="flex items-center gap-3 px-5 py-4 text-slate-500 hover:text-red-400 transition-colors text-sm font-medium">
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-16 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}