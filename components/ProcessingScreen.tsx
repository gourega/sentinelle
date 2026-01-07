
import React, { useEffect, useState, useRef } from 'react';
import { WasteReport, AIAnalysisResult, EvolutionEntry } from '../types';
import { analyzeWasteImage, findNearestRecyclingCenter, generateCleanVision, analyzeEvolution } from '../services/geminiService';
import { Analytics } from '../services/analytics';
import Logo from './Logo';

interface ProcessingScreenProps {
  image: string;
  onComplete: (result: any) => void;
  onCancel: () => void;
  updateParentId?: string | null;
  parentImage?: string;
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ image, onComplete, onCancel, updateParentId, parentImage }) => {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('Initialisation de l\'IA...');
  const [error, setError] = useState<string | null>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    Analytics.logAnalysisStart(!!updateParentId);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [updateParentId]);

  const runAnalysis = async () => {
    setError(null);
    try {
      if (updateParentId && parentImage) {
        setCurrentTask('Réflexion sur l\'évolution...');
        await new Promise(r => setTimeout(r, 1000));
        setCurrentTask('Comparaison des structures...');
        const evolution = await analyzeEvolution(parentImage, image);
        onComplete({
          timestamp: Date.now(),
          image,
          status: evolution.status,
          insight: evolution.insight
        } as EvolutionEntry);
      } else {
        setCurrentTask('Observation du site...');
        await new Promise(r => setTimeout(r, 800));
        setCurrentTask('Identification des matériaux...');
        const result = await analyzeWasteImage(image);
        
        setCurrentTask('Évaluation du potentiel vert...');
        const cleanVision = await generateCleanVision(image);
        
        setCurrentTask('Recherche de centres ANAGED...');
        let nearest = undefined;
        try {
          nearest = await findNearestRecyclingCenter(result.nature, result.city || "Abidjan");
        } catch (e) {
          console.warn("Recycling center lookup failed", e);
        }
        
        const finalReport: WasteReport = {
          id: `CI-${Date.now().toString().slice(-6)}`,
          timestamp: Date.now(),
          image,
          cleanVisionImage: cleanVision || undefined,
          actionPlan: result.actionPlan,
          history: [],
          location: { 
            lat: 5.3096, 
            lng: -4.0127, 
            address: "Validé", 
            city: result.city || "Abidjan", 
            sector: result.sector || "Secteur Inconnu" 
          },
          classification: { 
            nature: result.nature, 
            status: result.status, 
            confidence: result.confidence, 
            description: result.description, 
            items: result.classification 
          },
          severity: result.severity, 
          insight: result.insight, 
          nearestCenter: nearest
        };

        Analytics.logReportCreated(result.city || 'Inconnue', result.nature);

        // Try to get real GPS if possible
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            finalReport.location.lat = pos.coords.latitude;
            finalReport.location.lng = pos.coords.longitude;
            onComplete(finalReport);
          },
          () => {
            onComplete(finalReport);
          },
          { timeout: 5000 }
        );
      }
    } catch (err) { 
      console.error("Analysis Error:", err);
      setError("Le serveur IA est temporairement indisponible. Vérifiez votre connexion.");
    }
  };

  useEffect(() => {
    if (progress === 100 && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      runAnalysis();
    }
  }, [progress]);

  return (
    <div className="flex h-screen flex-col bg-background-dark items-center justify-center p-8 font-display">
      {!error ? (
        <>
          <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-primary/10 rounded-full animate-spin-slow"></div>
            <Logo size={120} animated />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent scanner-line rounded-full overflow-hidden"></div>
          </div>
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase">
              IA.<span className="text-primary">{updateParentId ? 'SUIVI' : 'ANALYSE'}</span>
            </h2>
            <div className="flex items-center justify-center gap-2">
               <span className="material-symbols-outlined text-[10px] text-primary animate-spin">psychology</span>
               <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">{currentTask}</p>
            </div>
          </div>
          <div className="w-full max-w-xs h-1.5 bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-primary shadow-[0_0_15px_#13ec6d] transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </>
      ) : (
        <div className="text-center space-y-8 animate-in zoom-in-95">
           <div className="size-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto">
             <span className="material-symbols-outlined text-4xl">error</span>
           </div>
           <div className="space-y-2">
             <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Erreur Système</h3>
             <p className="text-slate-500 text-sm px-8">{error}</p>
           </div>
           <div className="flex flex-col gap-3">
             <button onClick={() => { hasTriggeredRef.current = false; runAnalysis(); }} className="bg-primary text-background-dark py-5 px-12 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Réessayer</button>
             <button onClick={onCancel} className="py-4 text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">Annuler l'action</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingScreen;
