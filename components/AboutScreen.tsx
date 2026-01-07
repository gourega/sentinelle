
import React from 'react';
import Logo from './Logo';

interface AboutScreenProps {
  onBack: () => void;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-screen bg-background-dark font-display text-white overflow-y-auto no-scrollbar">
      {/* Header avec flou de profondeur */}
      <header className="sticky top-0 p-6 pt-12 bg-background-dark/95 backdrop-blur-xl z-30 border-b border-white/5 flex items-center gap-6">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 active:scale-90 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-black italic tracking-tighter uppercase">Notre <span className="text-primary">Mission</span></h2>
      </header>

      <main className="p-8 space-y-12 pb-24">
        {/* Hero Section */}
        <section className="space-y-6">
          <Logo size={70} animated />
          <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-[0.85]">
            L'Innovation <br/> au Service <span className="text-primary">du Civisme</span>
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            Sentinelle Verte est une plateforme de <strong>Gouvernance Collaborative</strong>. Nous transformons la technologie en un levier d'action pour chaque citoyen ivoirien désireux de voir sa commune briller.
          </p>
        </section>

        {/* Bloc Définition Civic Tech - Style exact de l'image fournie */}
        <section className="bg-[#08150e] p-10 rounded-[50px] border border-primary/5 shadow-2xl space-y-5">
           <h4 className="text-[10px] font-black text-white uppercase tracking-[0.5em] opacity-90">
             C'est quoi une Civic Tech ?
           </h4>
           <p className="text-slate-300 text-sm leading-relaxed italic font-medium">
             "Une Civic Tech est une passerelle numérique qui redonne le pouvoir d'agir au citoyen. C'est l'utilisation de l'innovation technologique pour booster l'engagement civique et rendre la gestion de notre cité plus transparente, efficace et inclusive."
           </p>
        </section>

        {/* Section Technique / Valeurs */}
        <section className="bg-surface-dark/40 p-8 rounded-[48px] border border-white/5 space-y-8">
          <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Nos Piliers</h4>
          
          <div className="space-y-8">
            <div className="flex gap-5">
              <div className="size-11 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                <span className="material-symbols-outlined text-xl">Bolt</span>
              </div>
              <div>
                <h5 className="text-sm font-black text-white uppercase italic mb-1 tracking-tight">Réactivité IA</h5>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Analyse instantanée des dépôts pour une catégorisation précise et une transmission rapide aux services compétents.</p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="size-11 shrink-0 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/10">
                <span className="material-symbols-outlined text-xl">Public</span>
              </div>
              <div>
                <h5 className="text-sm font-black text-white uppercase italic mb-1 tracking-tight">Impact Collectif</h5>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Chaque signalement nourrit une base de données publique permettant de mieux planifier la gestion des déchets au niveau national.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Citation de clôture - Style élégant */}
        <div className="py-8 px-4 text-center space-y-4">
           <div className="w-12 h-0.5 bg-primary/20 mx-auto"></div>
           <p className="text-[11px] text-slate-400 leading-relaxed italic max-w-[280px] mx-auto">
             "Sentinelle Verte CI n'est pas qu'une application, c'est un pacte entre la technologie et le civisme pour une Côte d'Ivoire émergente et propre."
           </p>
           <div className="w-12 h-0.5 bg-primary/20 mx-auto"></div>
        </div>

        <div className="pt-8 text-center opacity-30">
           <p className="text-[8px] font-black uppercase tracking-[0.3em]">Déploiement National v1.1.0 • Civic Tech CI</p>
        </div>
      </main>
    </div>
  );
};

export default AboutScreen;
