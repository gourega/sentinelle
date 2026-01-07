
import React, { useState } from 'react';
import { CitizenProject } from '../types';

interface SupportScreenProps {
  projects: CitizenProject[];
  onBack: () => void;
  onDonate: (projectId: string, amount: number) => void;
}

const SupportScreen: React.FC<SupportScreenProps> = ({ projects, onBack, onDonate }) => {
  const [donatingTo, setDonatingTo] = useState<string | null>(null);

  const handleSupport = (id: string) => {
    setDonatingTo(id);
    // Simulation Mobile Money CI
    setTimeout(() => {
      onDonate(id, 5000); 
      setDonatingTo(null);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-background-dark font-display text-white overflow-y-auto no-scrollbar relative">
      <header className="sticky top-0 p-6 pt-12 bg-background-dark/90 backdrop-blur-xl z-30 border-b border-white/5 flex items-center gap-6">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 active:scale-90 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-black italic tracking-tighter uppercase">Soutenir <span className="text-primary">l'Action</span></h2>
      </header>

      <main className="p-6 space-y-10 pb-24 relative z-10">
        <section className="space-y-2">
           <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Crowdfunding Civique</p>
           <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-[0.9]">Financer le <br/> <span className="text-primary">Matériel de Terrain</span></h3>
           <p className="text-slate-400 text-sm leading-relaxed font-medium">Les signalements sans action ne servent à rien. Soutenez les brigades de volontaires locaux qui nettoient votre commune.</p>
        </section>

        <div className="space-y-8">
           {projects.map(project => (
             <div key={project.id} className="bg-surface-dark/40 rounded-[48px] border border-white/5 overflow-hidden shadow-2xl flex flex-col group">
                <div className="h-48 relative overflow-hidden">
                   <img src={project.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={project.title} />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                   <div className="absolute bottom-4 left-6">
                      <h4 className="text-xl font-black italic text-white uppercase tracking-tighter">{project.title}</h4>
                      <p className="text-[10px] text-primary font-black uppercase tracking-widest">{project.location}</p>
                   </div>
                </div>
                
                <div className="p-8 space-y-6">
                   <div className="space-y-4">
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Récolté</p>
                            <p className="text-xl font-black italic text-white">{project.current.toLocaleString()} <span className="text-[10px] font-bold opacity-50">FCFA</span></p>
                         </div>
                         <div className="text-right">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Objectif</p>
                            <p className="text-xs font-bold text-slate-300">{project.goal.toLocaleString()} FCFA</p>
                         </div>
                      </div>
                      <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-primary shadow-[0_0_15px_rgba(19,236,109,0.5)] transition-all duration-1000" style={{ width: `${Math.min(100, (project.current/project.goal)*100)}%` }}></div>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Besoins prioritaires</p>
                      <ul className="space-y-2">
                         {project.needs.map((need, i) => (
                           <li key={i} className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                              <span className="material-symbols-outlined text-primary text-sm">shopping_cart</span>
                              <span className="truncate">{need}</span>
                           </li>
                         ))}
                      </ul>
                   </div>

                   <div className="space-y-3">
                      <button 
                        onClick={() => handleSupport(project.id)}
                        disabled={donatingTo !== null}
                        className="w-full py-5 bg-primary text-background-dark rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all disabled:opacity-50"
                      >
                        {donatingTo === project.id ? (
                          <span className="material-symbols-outlined animate-spin text-xl">sync</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                               <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                               <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                            </div>
                            <span>Don Mobile Money</span>
                          </div>
                        )}
                        {donatingTo === project.id ? 'Vérification...' : ''}
                      </button>
                      <p className="text-[8px] text-center text-slate-500 font-bold uppercase tracking-widest">Sécurisé via Orange / MTN / Wave / Moov</p>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </main>
    </div>
  );
};

export default SupportScreen;
