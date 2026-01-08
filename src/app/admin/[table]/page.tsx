'use client';

import React, { useState, useEffect, use } from 'react'; 
import { Plus, Save, Edit3, X, Database } from 'lucide-react';

export default function AdminUniversal({ params }: { params: Promise<{ table: string }> }) {
  const { table } = use(params); // 👈 Desenvolvemos el parámetro asíncrono
  const [rows, setRows] = useState<any[]>([]);
  const [cols, setCols] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${table}`);
      const result = await res.json();
      if (result.data) {
        setRows(result.data);
        setCols(result.columns); // Cargamos las columnas reales de la DB
      }
    } catch (e) { console.error("Error cargando:", e); }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [table]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/admin/${table}`, { 
      method: 'POST', 
      body: JSON.stringify(editing) 
    });
    if (res.ok) { setEditing(null); loadData(); }
    else { alert("Error al guardar información"); }
  };

  if (loading) return <div className="p-20 text-center text-slate-500 font-serif italic">Conectando con SQLite...</div>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-serif text-white italic capitalize">{table}</h1>
        <button onClick={() => setEditing({})} className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg">
          + Nuevo Registro
        </button>
      </header>

      <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-500">
            <tr>
              {cols.map(c => <th key={c.name} className="p-5">{c.name}</th>)}
              <th className="p-5 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.length > 0 ? rows.map((row, i) => (
              <tr key={i} className="hover:bg-white/[0.01]">
                {cols.map(c => (
                  <td key={c.name} className="p-5 max-w-[200px] truncate opacity-75 font-light">
                    {String(row[c.name] || '')}
                  </td>
                ))}
                <td className="p-5 text-right">
                  <button onClick={() => setEditing(row)} className="text-amber-500 hover:text-amber-400 font-bold uppercase text-[10px]">Editar</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={cols.length + 1} className="p-20 text-center text-slate-600 italic">No hay registros en {table}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] w-full max-w-xl max-h-[85vh] overflow-y-auto">
            <h2 className="text-amber-500 font-bold mb-6 uppercase tracking-widest text-center">Editor de {table}</h2>
            <div className="space-y-4">
              {cols.map(c => (
                <div key={c.name} className="flex flex-col gap-1">
                  <label className="text-[9px] text-slate-500 uppercase font-bold ml-1">{c.name}</label>
                  <textarea 
                    readOnly={c.pk === 1} // Si es Primary Key, no se edita
                    placeholder={c.name === 'fecha_publicacion' ? 'YYYY-MM-DD' : `Ingresar ${c.name}...`}
                    className={`bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-amber-500 ${c.pk === 1 ? 'opacity-30' : ''}`}
                    value={editing[c.name] || ''}
                    onChange={e => setEditing({...editing, [c.name]: e.target.value})}
                  />
                </div>
              ))}
            </div>
            <button type="submit" className="w-full mt-8 bg-amber-600 py-4 rounded-xl font-bold shadow-lg">Guardar en Base de Datos</button>
            <button type="button" onClick={() => setEditing(null)} className="w-full mt-2 text-slate-600 text-[10px] uppercase font-bold">Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
}