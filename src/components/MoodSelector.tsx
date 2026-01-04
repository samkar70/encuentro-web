'use client';

import React from 'react';
import { Heart, Shield, Sparkles } from 'lucide-react';

interface Mood {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  category: string;
}

const moods: Mood[] = [
  { id: 'paz', label: 'Busco Paz', icon: <Sparkles className="w-6 h-6" />, color: 'bg-blue-600', category: 'Momentos' },
  { id: 'fortaleza', label: 'Necesito Fortaleza', icon: <Shield className="w-6 h-6" />, color: 'bg-amber-600', category: 'Short' },
  { id: 'adorar', label: 'Quiero Adorar', icon: <Heart className="w-6 h-6" />, color: 'bg-red-600', category: 'Musica' },
];

interface MoodSelectorProps {
  onSelect: (category: string) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ onSelect }) => {
  return (
    <div className="py-12 text-center border-y border-white/5 my-10 bg-slate-900/20 rounded-3xl">
      <h2 className="text-xl font-light text-slate-400 mb-8 italic">
        ¿Cómo está tu corazón hoy, Samuel?
      </h2>
      <div className="flex flex-wrap justify-center gap-6">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onSelect(mood.category)}
            className={`${mood.color} hover:scale-105 transition-all duration-300 px-8 py-4 rounded-2xl flex items-center gap-3 text-white font-bold shadow-xl active:scale-95`}
          >
            {mood.icon}
            {mood.label}
          </button>
        ))}
      </div>
    </div>
  );
};