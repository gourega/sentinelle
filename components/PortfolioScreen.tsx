
import React, { useState } from 'react';
import { WasteReport, OFFICIAL_BADGES, UserProfile } from '../types';
import Logo from './Logo';

interface PortfolioScreenProps {
  reports: WasteReport[];
  stats: { points: number; solutionsCount: number; reportsCount: number };
  profile: UserProfile;
  user: { uid: string, displayName: string } | null;
  isSyncing: boolean;
  onLogin: () => void;
  onLogout: () => void;
  initialTab?: 'mine' | 'community';
  onUpdateProfile: (p: UserProfile) => void;
  onBack: () => void;
  onStartReporting: () => void;
  onViewDetail: (id: string) => void;
}

const PortfolioScreen: React.FC<PortfolioScreenProps> = ({ 
  reports, stats, profile, user, isSyncing, onLogin, onLogout, 
  initialTab = 'mine', onUpdateProfile, onBack, onViewDetail 
}) => {
  const [tab, setTab] = useState<'mine' | 'community'>(initialTab);
  const [isEditing, setIsEditing] = useState(false);

  const getGrade = (pts: number) => {
    if (pts > 1000) return "Ambassadeur National";
    if (pts > 500) return "Gardien de la Cité";
    if (pts > 200) return "Sentinelle Active";
    return "Éco-Volontaire";
  };

  return (
    <div className="bg-background-dark text-white min-h-screen flex flex-col relative font-display overflow-x-hidden">
      <header className="sticky top-0 z-30 bg-background-dark/95 backdrop-blur-2xl border-b border-white/5 px-6 py-6 flex items-center justify-between">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 text-slate-400">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex bg-surface-dark p-1 rounded-2xl border border-white/5">
          <button onClick={() => setTab('mine')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${tab === 'mine' ? 'bg-primary text-background-dark' : 'text-slate-500'}`}>Mon Impact</button>
          <button onClick={() => setTab('community')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${tab === 'community' ? 'bg-primary text-background-dark' : 'text-slate-500'}`}>Nation</button>
        </div>
        <button onClick={() => setIsEditing(true)} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      <main className="flex-1 pb-40 px-6 pt-6">
        {tab === 'mine' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            {/* Identity Card */}
            <div className="relative bg-gradient-to-br from-surface-dark to-black p-8 rounded-[48px] border border-white/10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                 {user ? (
                   <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                     <span className="material-symbols-outlined text-[10px] text-primary">cloud_done</span>
                     <span className="text-[8px] font-black text-primary uppercase tracking-widest">Mock Sync Active</span>
                   </div>
                 ) : (
                   <button onClick={onLogin} className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full animate-pulse">
                     <span className="material-symbols-outlined text-[10px] text-orange-500">login</span>
                     <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">Connecter Profil</span>
                   </button>
                 )}
              </div>
              
              <div className="relative z-10 flex items-center gap-6 mb-8">
                <div className="size-20 rounded-[24px] bg-primary/20 border-2 border-primary/40 p-1">
                  <img src={profile.avatar} className="w-full h-full rounded-[20px] bg-slate-900" alt="Avatar" />
                </div>
                <div>
                  <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter leading-none">{profile.username}</h2>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mt-1">{getGrade(stats.points)}</p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">ID: {profile.idNumber}</p>
                </div>
              </div>

              {!user && (
                <button 
                  onClick={onLogin}
                  className="w-full py-4 mb-6 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all group"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Activer le Suivi Cloud (Simulé)</span>
                </button>
              )}

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                   <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Impact Global</p>
                   <p className="text-2xl font-black italic">{stats.points}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                   <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Série</p>
                   <p className="text-2xl font-black italic text-primary truncate">{profile.streak} jours</p>
                </div>
              </div>
              
              {user && (
                <button 
                  onClick={onLogout}
                  className="w-full py-4 text-[9px] font-black text-red-500/50 uppercase tracking-[0.3em] hover:text-red-500 transition-colors"
                >
                  Fermer la session locale
                </button>
              )}
            </div>

            {/* Mes Signalements */}
            <section className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-2">Historique d'Impact</h3>
              <div className="space-y-3">
                {reports.length === 0 ? (
                  <div className="py-12 border-2 border-dashed border-white/5 rounded-[40px] text-center opacity-30">
                    <p className="text-[10px] font-black uppercase">Aucun rapport sauvegardé</p>
                  </div>
                ) : (
                  reports.slice(0, 10).map(report => (
                    <div key={report.id} onClick={() => onViewDetail(report.id)} className="bg-white/5 border border-white/5 p-4 rounded-3xl flex items-center gap-4 active:scale-95 transition-all">
                      <img src={report.image} className="size-12 rounded-xl object-cover" alt="site" />
                      <div className="flex-1">
                        <p className="text-xs font-black italic">{report.classification.nature}</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase">{report.location.sector}</p>
                      </div>
                      <span className="material-symbols-outlined text-primary text-sm">chevron_right</span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        ) : (
          <div className="text-center py-20 opacity-40">
            <span className="material-symbols-outlined text-6xl mb-4">public</span>
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Impact National (Simulé)</p>
          </div>
        )}
      </main>

      {/* Navigation Bottom identique */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background-dark/95 backdrop-blur-3xl border-t border-white/5 pb-10 pt-6 grid grid-cols-3 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] px-8">
        <div onClick={onBack} className="flex flex-col items-center gap-2 opacity-40 hover:opacity-100 cursor-pointer">
          <span className="material-symbols-outlined text-[28px]">home</span>
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Accueil</span>
        </div>
        <div onClick={() => setTab('mine')} className={`flex flex-col items-center gap-2 transition-all ${tab === 'mine' ? 'text-primary' : 'opacity-40'}`}>
          <span className="material-symbols-outlined text-[28px] font-black">badge</span>
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Profil</span>
        </div>
        <div onClick={() => setTab('community')} className={`flex flex-col items-center gap-2 transition-all ${tab === 'community' ? 'text-primary' : 'opacity-40'}`}>
          <span className="material-symbols-outlined text-[28px]">flag_circle</span>
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Nation</span>
        </div>
      </nav>
    </div>
  );
};

export default PortfolioScreen;
