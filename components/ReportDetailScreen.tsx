
import React, { useState } from 'react';
import { WasteReport, EvolutionEntry } from '../types';
import { formatOfficialReport } from '../services/geminiService';

interface ReportDetailScreenProps {
  report: WasteReport;
  onBack: () => void;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

const ReportDetailScreen: React.FC<ReportDetailScreenProps> = ({ report, onBack, onDelete, onUpdate }) => {
  const [activeImage, setActiveImage] = useState(report.image);
  const [activeInsight, setActiveInsight] = useState(report.classification.description);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showCertificate, setShowCertificate] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const isResolved = report.classification.status.includes('Résolue') || 
                     report.history.some(h => h.status.includes('Résolue'));

  const handleShareOfficial = () => {
    const text = isResolved 
      ? `✅ *RÉUSSITE ÉCOLOGIQUE - SENTINELLE VERTE CI*\n\nUn site pollué à ${report.location.city} a été nettoyé ! Découvrez l'impact de l'action citoyenne.\n\n` + formatOfficialReport(report)
      : formatOfficialReport(report);
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleDownloadAttestation = () => {
    setIsDownloading(true);
    const reportText = formatOfficialReport(report);
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Certificat_SentinelleVerte_${report.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      setIsDownloading(false);
      alert("Votre attestation officielle a été téléchargée avec succès.");
    }, 1000);
  };

  if (showCertificate) {
    return (
      <div className="fixed inset-0 z-[60] bg-background-dark flex flex-col font-display text-white p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 pt-6">
          <button onClick={() => setShowCertificate(false)} className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
             <span className="material-symbols-outlined">close</span>
          </button>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Preuve d'Impact Officielle</p>
        </header>

        <div className="flex-1 space-y-8 pb-12">
          <div className="bg-white p-8 rounded-[40px] text-slate-900 shadow-2xl space-y-6 relative overflow-hidden border-t-[12px] border-primary animate-in zoom-in-95 duration-300">
             <div className="flex justify-between items-start">
               <div>
                 <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none mb-1">Certificat <br/> de Résolution</h2>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sentinelle Verte CI</p>
               </div>
               <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center text-primary border-4 border-primary">
                 <span className="material-symbols-outlined text-4xl font-black">check</span>
               </div>
             </div>

             <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[8px] font-black uppercase text-slate-400">Dossier ID</p>
                    <p className="text-xs font-bold font-mono">{report.id}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase text-slate-400">Localisation</p>
                    <p className="text-xs font-bold">{report.location.city}, {report.location.sector}</p>
                  </div>
                </div>

                <div>
                   <p className="text-[8px] font-black uppercase text-slate-400 mb-2">Avant / Après</p>
                   <div className="grid grid-cols-2 gap-2 h-32">
                      <div className="rounded-xl overflow-hidden grayscale opacity-50">
                        <img src={report.image} className="w-full h-full object-cover" alt="Before" />
                      </div>
                      <div className="rounded-xl overflow-hidden">
                        <img src={report.history.find(h => h.status.includes('Résolue'))?.image || report.image} className="w-full h-full object-cover" alt="After" />
                      </div>
                   </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl">
                   <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Conclusion de l'Expertise IA</p>
                   <p className="text-[11px] leading-relaxed font-medium italic text-slate-600">"{report.history.find(h => h.status.includes('Résolue'))?.insight || report.classification.description}"</p>
                </div>
             </div>

             <div className="pt-4 flex justify-between items-end border-t border-slate-100">
                <div>
                  <p className="text-[8px] font-black uppercase text-slate-300">Date de validation</p>
                  <p className="text-xs font-bold">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <div className="size-12 rounded-xl border-2 border-slate-100 flex items-center justify-center text-slate-200 ml-auto mb-1">
                    <span className="material-symbols-outlined text-sm">qr_code_2</span>
                  </div>
                  <p className="text-[7px] font-black uppercase text-slate-300 tracking-tighter">Vérifié par Gemini 3</p>
                </div>
             </div>
          </div>

          <p className="text-center text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">Ce document atteste de l'engagement civique et de la restauration effective d'un espace public en Côte d'Ivoire.</p>
        </div>

        <button 
          onClick={handleDownloadAttestation}
          disabled={isDownloading}
          className="mt-auto w-full py-6 bg-primary text-background-dark rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
        >
          {isDownloading ? (
            <span className="material-symbols-outlined animate-spin">sync</span>
          ) : (
            <span className="material-symbols-outlined">download</span>
          )}
          {isDownloading ? 'Génération...' : "Télécharger l'Attestation"}
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col bg-background-dark overflow-y-auto font-display animate-in fade-in duration-500">
      <header className="sticky top-0 z-20 flex items-center bg-background-dark/95 backdrop-blur-md px-6 py-4 pt-10 border-b border-white/5">
        <button onClick={onBack} className="text-white w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 active:scale-90 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-white text-lg font-black italic tracking-tighter uppercase flex-1 text-center pr-10">Suivi <span className="text-primary">Impact</span></h2>
      </header>

      <main className="flex-1 p-6 space-y-8 pb-32">
        {/* Main Display Image */}
        <div className="rounded-[40px] overflow-hidden shadow-2xl relative border border-white/5 bg-slate-900 aspect-square group">
          <img src={activeImage} className="w-full h-full object-cover transition-all duration-500" alt="Etape" />
          
          {isResolved && (
            <div className="absolute inset-0 bg-primary/10 pointer-events-none flex items-center justify-center">
               <div className="size-32 rounded-full bg-primary/20 backdrop-blur-xl border-4 border-primary flex items-center justify-center animate-bounce shadow-[0_0_50px_rgba(19,236,109,0.5)]">
                 <span className="material-symbols-outlined text-primary text-6xl font-black">check_circle</span>
               </div>
            </div>
          )}

          <div className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
             <span className="text-[10px] font-black uppercase text-white tracking-widest">
               {activeIndex === -1 ? 'État Initial' : `Mise à jour #${activeIndex + 1}`}
             </span>
          </div>
        </div>

        {/* Timeline Horizontal */}
        <div className="space-y-4">
           <div className="flex justify-between items-center px-2">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Chronologie</h3>
             {isResolved && (
               <button 
                onClick={() => setShowCertificate(true)}
                className="flex items-center gap-1.5 text-[9px] font-black text-primary uppercase border border-primary/30 rounded-full px-3 py-1 bg-primary/10 active:scale-90 transition-all"
               >
                 <span className="material-symbols-outlined text-[14px]">military_tech</span>
                 Certificat
               </button>
             )}
           </div>
           <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 pt-2 px-1">
              <button 
                onClick={() => { setActiveImage(report.image); setActiveInsight(report.classification.description); setActiveIndex(-1); }}
                className={`size-24 shrink-0 rounded-3xl overflow-hidden border-2 transition-all relative ${activeIndex === -1 ? 'border-primary scale-110 shadow-[0_10px_30px_rgba(19,236,109,0.3)] z-10' : 'border-white/5 opacity-50 grayscale'}`}
              >
                <img src={report.image} className="w-full h-full object-cover" alt="T0" />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-[8px] font-black uppercase text-center text-white">Start</div>
              </button>

              {report.history.map((entry, idx) => (
                <button 
                  key={idx}
                  onClick={() => { setActiveImage(entry.image); setActiveInsight(entry.insight); setActiveIndex(idx); }}
                  className={`size-24 shrink-0 rounded-3xl overflow-hidden border-2 transition-all relative ${activeIndex === idx ? 'border-primary scale-110 shadow-[0_10px_30px_rgba(19,236,109,0.3)] z-10' : 'border-white/5 opacity-50 grayscale'}`}
                >
                  <img src={entry.image} className="w-full h-full object-cover" alt={`T${idx + 1}`} />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-[8px] font-black uppercase text-center text-white">+{idx + 1}j</div>
                </button>
              ))}

              <button 
                onClick={onUpdate}
                disabled={isResolved}
                className={`size-24 shrink-0 rounded-3xl flex flex-col items-center justify-center gap-1 group active:scale-95 transition-all border-2 border-dashed ${isResolved ? 'opacity-20 border-slate-700' : 'bg-primary/5 border-primary/30 hover:bg-primary/10'}`}
              >
                <span className="material-symbols-outlined text-primary">add_a_photo</span>
                <span className="text-[8px] font-black text-primary uppercase">Actualiser</span>
              </button>
           </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-dark/60 p-7 rounded-[40px] border border-white/5 shadow-inner space-y-4">
            <div className="flex items-center gap-3">
              <div className={`size-8 rounded-xl flex items-center justify-center ${isResolved ? 'bg-primary/20 text-primary' : 'bg-orange-500/20 text-orange-500'}`}>
                <span className="material-symbols-outlined text-sm">{isResolved ? 'verified' : 'pending_actions'}</span>
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Analyse de l'étape</h4>
            </div>
            <p className="text-white text-xl font-black italic tracking-tighter">
              {activeIndex === -1 ? report.classification.status : report.history[activeIndex].status}
            </p>
            <p className="text-slate-300 text-sm leading-relaxed font-medium italic opacity-80">"{activeInsight}"</p>
          </div>

          <div className="bg-primary/10 border border-primary/20 p-8 rounded-[40px] space-y-4 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 opacity-5 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
              <span className="material-symbols-outlined text-9xl">share</span>
            </div>
            <h4 className="text-sm font-black text-white uppercase italic relative z-10">Diffusion d'Impact</h4>
            <button onClick={handleShareOfficial} className="w-full py-5 bg-primary text-background-dark rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all relative z-10">
              <span className="material-symbols-outlined text-sm">share</span> Partager sur WhatsApp
            </button>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-40">
        <button onClick={() => onDelete(report.id)} className="w-full py-5 bg-red-500/5 text-red-500/60 rounded-2xl flex items-center justify-center gap-2 border border-red-500/10 font-black uppercase text-xs tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all">
          <span className="material-symbols-outlined text-sm">delete_sweep</span> Supprimer le Dossier
        </button>
      </div>
    </div>
  );
};

export default ReportDetailScreen;
