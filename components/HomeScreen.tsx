
import React from 'react';
import Logo from './Logo';
import { UserProfile } from '../types';

interface HomeScreenProps {
  onStart: () => void;
  onGoToPortfolio: () => void;
  onOpenAssistant: () => void;
  onOpenAbout: () => void;
  onOpenSupport: () => void;
  onOpenAdmin: () => void;
  onOpenNation: () => void;
  cityName: string;
  profile: UserProfile;
  stats: { points: number };
  activeCitizens: number;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onStart, 
  onGoToPortfolio, 
  onOpenAssistant, 
  onOpenAbout, 
  onOpenSupport, 
  onOpenAdmin, 
  onOpenNation, 
  cityName, 
  profile, 
  stats,
  activeCitizens
}) => {
  return (
    <div className="relative flex h-screen w-full flex-col bg-background-dark overflow-hidden font-display">
      {/* 1. Fond d'écran immersif avec overlay progressif */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=1600" 
          alt="Contexte Urbain"
          className="w-full h-full object-cover opacity-25 grayscale scale-110 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark via-background-dark/40 to-background-dark"></div>
        {/* Cercles de lumière subtils */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      </div>

      {/* 2. Header Dashboard - Focus Profil & Rang */}
      <header className="flex items-center justify-between px-6 py-10 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Logo size={42} animated />
          <div className="leading-tight">
            <h1 className="text-sm font-black tracking-tighter text-white uppercase italic">Sentinelle <span className="text-primary">Verte</span></h1>
            <p className="text-[7px] text-slate-400 font-bold uppercase tracking-[0.3em]">Civic Tech CI</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Streak Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
            <span className="material-symbols-outlined text-[14px] text-orange-500 font-black">local_fire_department</span>
            <span className="text-[10px] font-black text-orange-500">{profile.streak}j</span>
          </div>

          <button 
            onClick={onGoToPortfolio}
            className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 pl-2 pr-4 py-1.5 rounded-2xl active:scale-95 transition-all shadow-2xl"
          >
            <div className="size-8 rounded-xl overflow-hidden border border-primary/20 bg-slate-800">
              <img src={profile.avatar} className="w-full h-full object-cover" alt="Avatar" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-white leading-none mb-0.5">{stats.points} pts</p>
              <p className="text-[7px] font-bold text-primary uppercase tracking-widest leading-none truncate max-w-[60px]">{profile.commune}</p>
            </div>
          </button>
        </div>
      </header>

      {/* 3. Zone Centrale - Le Radar d'Impact */}
      <main className="flex-1 flex flex-col justify-center px-8 relative z-10 -mt-8">
        <div className="text-center space-y-10">
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3 mb-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">Scanner actif : {cityName}</p>
              </div>
              
              {/* Live Citizen Pulse */}
              <div className="flex items-center gap-1.5 opacity-60">
                <div className="size-1 bg-primary rounded-full animate-ping"></div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{activeCitizens} Citoyens en ligne</p>
              </div>
            </div>
            
            <h2 className="text-5xl font-black italic tracking-tighter text-white uppercase leading-[0.85] animate-in slide-in-from-bottom-6 duration-700">
              Nettoyons la <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Cité ensemble.</span>
            </h2>
          </div>

          {/* Bouton de signalement précis */}
          <div className="relative inline-block mx-auto animate-in zoom-in-90 duration-500 delay-200">
            <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse"></div>
            <div className="absolute -inset-4 border border-primary/10 rounded-full animate-spin-slow"></div>
            
            <button 
              onClick={onStart}
              className="relative size-48 bg-primary rounded-full flex flex-col items-center justify-center gap-3 shadow-[0_30px_70px_rgba(19,236,109,0.5)] active:scale-90 transition-all hover:scale-105 border-[8px] border-background-dark group"
            >
              <span className="material-symbols-outlined text-5xl text-background-dark font-black group-hover:scale-110 transition-transform">photo_camera</span>
              <div className="text-center">
                <p className="text-[10px] font-black text-background-dark uppercase tracking-widest leading-none">Signaler</p>
                <p className="text-[12px] font-black text-background-dark uppercase italic tracking-tighter leading-tight">Un dépôt</p>
              </div>
            </button>
          </div>

          {/* Mission du Jour Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-[32px] max-w-xs mx-auto flex items-center gap-4 group hover:bg-white/10 transition-all cursor-pointer">
            <div className="size-10 shrink-0 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20 group-hover:rotate-12 transition-transform shadow-inner">
              <span className="material-symbols-outlined text-xl">target</span>
            </div>
            <div className="text-left">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Mission du Jour</p>
              <p className="text-[11px] font-bold text-white uppercase tracking-tight leading-tight">Vérifier l'état de ton quartier pour +50 pts</p>
            </div>
          </div>
        </div>
      </main>

      {/* 4. Barre d'Outils Contextuelle */}
      <div className="px-6 pb-12 z-20 space-y-6">
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
          {/* NATION */}
          <button 
            onClick={onOpenNation}
            className="shrink-0 flex items-center gap-4 bg-primary/20 backdrop-blur-md border border-primary/30 p-5 rounded-[28px] active:scale-95 transition-all shadow-[0_10px_30px_rgba(19,236,109,0.2)]"
          >
            <div className="size-11 rounded-xl bg-primary flex items-center justify-center text-background-dark border border-white/20">
              <span className="material-symbols-outlined text-xl font-black">flag_circle</span>
            </div>
            <div className="text-left pr-2">
              <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Nation</p>
              <p className="text-sm font-black text-white uppercase italic tracking-tighter leading-none">Impact CI</p>
            </div>
          </button>

          {/* Assistant IA */}
          <button 
            onClick={onOpenAssistant}
            className="shrink-0 flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-[28px] active:scale-95 transition-all"
          >
            <div className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10">
              <span className="material-symbols-outlined text-xl">auto_fix_high</span>
            </div>
            <div className="text-left pr-2">
              <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Conseils</p>
              <p className="text-sm font-black text-white uppercase italic tracking-tighter leading-none">Assistant IA</p>
            </div>
          </button>

          {/* Brigades de Support */}
          <button 
            onClick={onOpenSupport}
            className="shrink-0 flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-[28px] active:scale-95 transition-all"
          >
            <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <span className="material-symbols-outlined text-xl">volunteer_activism</span>
            </div>
            <div className="text-left pr-2">
              <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Soutenir</p>
              <p className="text-sm font-black text-white uppercase italic tracking-tighter leading-none">Brigades</p>
            </div>
          </button>

          {/* Tuile Mission (À Propos) */}
          <button 
            onClick={onOpenAbout}
            className="shrink-0 flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-[28px] active:scale-95 transition-all"
          >
            <div className="size-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <span className="material-symbols-outlined text-xl">info</span>
            </div>
            <div className="text-left pr-2">
              <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Comprendre</p>
              <p className="text-sm font-black text-white uppercase italic tracking-tighter leading-none">La Mission</p>
            </div>
          </button>

          {/* Accès Admin discret */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              onOpenAdmin();
            }}
            className="shrink-0 flex items-center justify-center size-[74px] bg-white/5 border border-white/5 rounded-[28px] active:scale-95 transition-all opacity-20 hover:opacity-100 group"
            aria-label="Administration"
          >
            <span className="material-symbols-outlined text-xl text-slate-500 group-hover:text-white transition-colors">admin_panel_settings</span>
          </button>
        </div>

        {/* Impact Ticker */}
        <div className="bg-primary/10 py-3.5 rounded-2xl overflow-hidden whitespace-nowrap border border-primary/10 backdrop-blur-md">
          <div className="inline-block animate-[scroll_35s_linear_infinite] px-4">
            <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mr-16 italic">🇨🇮 Yopougon : 14 signalements résolus cette semaine</span>
            <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mr-16 italic">🚀 Félicitations à @{profile.username} pour son 5ème badge !</span>
            <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mr-16 italic">💡 Astuce : Signalez les dépôts sauvages avant 9h pour une intervention rapide</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HomeScreen;
