
import React, { useEffect, useState } from 'react';
import { Badge } from '../types';
import { Analytics } from '../services/analytics';

interface CelebrationOverlayProps {
  badge: Badge;
  onClose: () => void;
}

const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({ badge, onClose }) => {
  const [confetti, setConfetti] = useState<number[]>([]);

  useEffect(() => {
    Analytics.logBadgeUnlocked(badge.title);
    // Generate 50 confetti pieces
    setConfetti(Array.from({ length: 50 }, (_, i) => i));
  }, [badge]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-background-dark/95 backdrop-blur-2xl animate-in fade-in duration-500">
      {/* Confetti Animation */}
      {confetti.map((c) => (
        <div 
          key={c}
          className="confetti-piece animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            backgroundColor: ['#13ec6d', '#ffffff', '#0ea34d', '#ff9900'][Math.floor(Math.random() * 4)],
            transform: `scale(${0.5 + Math.random()})`
          }}
        />
      ))}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-sm bg-surface-dark border-2 border-primary/30 rounded-[48px] p-10 text-center shadow-[0_0_80px_rgba(19,236,109,0.2)] animate-in zoom-in-95 duration-500 delay-200">
        <div className="mb-8 relative inline-block">
          <div className="absolute inset-0 bg-primary/40 blur-2xl rounded-full animate-ping opacity-50"></div>
          <div className="size-24 rounded-[32px] bg-primary flex items-center justify-center text-background-dark shadow-2xl relative z-10 border-4 border-white/20">
            <span className="material-symbols-outlined text-5xl font-black">{badge.icon}</span>
          </div>
        </div>

        <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.6em] mb-2">Badge Débloqué !</h2>
        <h3 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none mb-4">{badge.title}</h3>
        <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed px-4">
          Félicitations, Citoyen ! <br/> {badge.description}.
        </p>

        <div className="space-y-3">
          <button 
            onClick={onClose}
            className="w-full py-5 bg-primary text-background-dark rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            Continuer l'Impact
          </button>
          <button 
            onClick={() => {
               const text = `Je viens de débloquer le badge "${badge.title}" sur Sentinelle Verte CI ! Rejoignez-moi pour rendre la Côte d'Ivoire plus propre. 🇨🇮`;
               window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
            }}
            className="w-full py-4 bg-white/5 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/5 active:scale-95 transition-all"
          >
            Partager ma Victoire
          </button>
        </div>
      </div>
    </div>
  );
};

export default CelebrationOverlay;
