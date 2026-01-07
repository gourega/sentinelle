
import React, { useState, useEffect, useRef } from 'react';
import { WasteReport } from '../types';
import { generateAnalysisAudio } from '../services/geminiService';

interface AnalysisScreenProps {
  report: WasteReport;
  onConfirm: () => void;
  onBack: () => void;
}

const AnalysisScreen: React.FC<AnalysisScreenProps> = ({ report, onConfirm, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCleanVision, setShowCleanVision] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    return () => {
      if (sourceRef.current) sourceRef.current.stop();
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  const handlePlayAudio = async () => {
    if (isPlaying) {
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current = null;
      }
      setIsPlaying(false);
      return;
    }
    
    setIsPlaying(true);
    
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const audioCtx = audioCtxRef.current;
      
      // Crucial pour mobile: reprendre le contexte sur interaction utilisateur
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      const base64Audio = await generateAnalysisAudio(`Analyse de l'expert : Ce dépôt est de nature ${report.classification.nature}. ${report.insight}`);
      
      if (base64Audio) {
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const dataInt16 = new Int16Array(bytes.buffer);
        const frameCount = dataInt16.length;
        const buffer = audioCtx.createBuffer(1, frameCount, 24000);
        const channelData = buffer.getChannelData(0);

        for (let i = 0; i < frameCount; i++) {
          channelData[i] = dataInt16[i] / 32768.0;
        }

        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.onended = () => setIsPlaying(false);
        sourceRef.current = source;
        source.start();
      } else {
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Audio playback error:", error);
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark font-display text-white overflow-y-auto pb-32">
      <header className="p-6 pt-12 flex items-center justify-between sticky top-0 bg-background-dark/90 backdrop-blur-xl z-30 border-b border-white/5">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 active:scale-90 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-black italic tracking-tighter uppercase">Rapport <span className="text-primary">Impact</span></h2>
        <div className="w-10"></div>
      </header>

      <main className="p-6 space-y-8">
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Visualisation IA</h3>
            <button 
              onClick={() => setShowCleanVision(!showCleanVision)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all shadow-lg ${showCleanVision ? 'bg-primary text-background-dark' : 'bg-white/5 text-primary border border-primary/20'}`}
            >
              {showCleanVision ? 'Voir Réel' : 'Vision Propre'}
            </button>
          </div>
          <div className="relative aspect-video rounded-[32px] overflow-hidden shadow-2xl border border-white/5 bg-slate-900 group">
            <img 
              src={showCleanVision && report.cleanVisionImage ? report.cleanVisionImage : report.image} 
              className="w-full h-full object-cover transition-all duration-700 ease-in-out" 
              alt="Analyse" 
            />
            {showCleanVision && (
              <div className="absolute top-4 left-4 bg-primary/20 backdrop-blur-md px-3 py-1 rounded-lg border border-primary/30 animate-pulse">
                <span className="text-[9px] font-black uppercase text-primary italic">Futur Souhaité</span>
              </div>
            )}
            <button 
              onClick={handlePlayAudio}
              className={`absolute bottom-4 right-4 size-14 rounded-full flex items-center justify-center backdrop-blur-md border-2 transition-all active:scale-90 z-20 ${isPlaying ? 'bg-primary text-background-dark border-primary shadow-[0_0_20px_#13ec6d]' : 'bg-black/40 text-primary border-primary/30 hover:bg-black/60'}`}
            >
              <span className="material-symbols-outlined text-3xl">{isPlaying ? 'graphic_eq' : 'volume_up'}</span>
            </button>
          </div>
        </div>

        <div className="text-center space-y-1">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">{report.classification.nature}</p>
          <h1 className="text-4xl font-black italic tracking-tighter leading-none">{report.classification.status}</h1>
          <p className="text-slate-400 text-sm font-medium">{report.location.city} • {report.location.sector}</p>
        </div>

        <div className="bg-surface-dark/60 backdrop-blur-md p-7 rounded-[40px] border border-white/5 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Plan d'Action IA</h3>
            <span className="material-symbols-outlined text-primary/40">assignment_turned_in</span>
          </div>
          <div className="space-y-5">
            {report.actionPlan?.map((step, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="size-7 shrink-0 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-black text-primary shadow-inner">
                  {i + 1}
                </div>
                <p className="text-sm text-slate-300 font-medium leading-relaxed group-hover:text-white transition-colors">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-primary/5 rounded-[40px] border border-primary/10 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 rotate-12 group-hover:rotate-45 transition-transform duration-700">
             <span className="material-symbols-outlined text-8xl">lightbulb</span>
          </div>
          <h3 className="text-white text-xs font-black mb-3 flex items-center gap-2 relative z-10">
            <span className="material-symbols-outlined text-primary text-sm">psychology</span> Conseil de l'Expert
          </h3>
          <p className="text-slate-300 text-sm italic leading-relaxed relative z-10">"{report.insight}"</p>
        </div>

        {report.nearestCenter && (
          <div className="bg-white/5 p-6 rounded-[40px] border border-white/5 space-y-3">
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Collecte Proche</p>
             <a 
               href={report.nearestCenter.url} 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center justify-between bg-primary/10 p-4 rounded-2xl border border-primary/20 group hover:bg-primary/20 transition-colors"
             >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="material-symbols-outlined text-primary shrink-0">location_city</span>
                  <span className="text-xs font-bold text-white truncate">{report.nearestCenter.name}</span>
                </div>
                <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">open_in_new</span>
             </a>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent pt-16 z-40">
        <button 
          onClick={onConfirm} 
          className="w-full bg-primary text-background-dark py-6 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(19,236,109,0.4)] active:scale-95 transition-all hover:brightness-110"
        >
          Valider le Signalement
        </button>
      </div>
    </div>
  );
};

export default AnalysisScreen;
