
import React, { useState, useMemo } from 'react';
import { WasteReport, CitizenProject } from '../types';
import { optimizeCampaignDescription } from '../services/geminiService';
import Logo from './Logo';

interface AdminDashboardProps {
  reports: WasteReport[];
  projects: CitizenProject[];
  onUpdateProjects: (projects: CitizenProject[]) => void;
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ reports, projects, onUpdateProjects, onBack }) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'projects'>('alerts');
  const [filter, setFilter] = useState<'all' | 'high' | 'resolved'>('all');
  const [editingProject, setEditingProject] = useState<CitizenProject | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const stats = useMemo(() => {
    const total = reports.length;
    const highSeverity = reports.filter(r => r.severity === 'Élevée').length;
    const resolved = reports.filter(r => r.history.some(h => h.status.includes('Résolue'))).length;
    return { total, highSeverity, resolved };
  }, [reports]);

  const filteredReports = useMemo(() => {
    if (filter === 'high') return reports.filter(r => r.severity === 'Élevée');
    if (filter === 'resolved') return reports.filter(r => r.history.some(h => h.status.includes('Résolue')));
    return reports;
  }, [reports, filter]);

  const handleAddProject = () => {
    const newProject: CitizenProject = {
      id: Date.now().toString(),
      title: 'Besoin de nettoyage',
      location: 'Abidjan',
      goal: 100000,
      current: 0,
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?auto=format&fit=crop&q=80&w=600',
      needs: ['Gants de protection', 'Sacs poubelles renforcés']
    };
    onUpdateProjects([newProject, ...projects]);
    setEditingProject(newProject);
  };

  const handleUpdateProjectField = (id: string, field: keyof CitizenProject, value: any) => {
    onUpdateProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleOptimizeByIA = async (project: CitizenProject) => {
    setIsOptimizing(true);
    try {
      const result = await optimizeCampaignDescription(project.title, project.location, project.needs);
      if (result.optimizedTitle) {
        onUpdateProjects(projects.map(p => p.id === project.id ? { 
          ...p, 
          title: result.optimizedTitle,
          needs: [...p.needs, result.description].slice(0, 5) // On utilise la description dans les besoins pour la démo
        } : p));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("Supprimer cette cagnotte ?")) {
      onUpdateProjects(projects.filter(p => p.id !== id));
      setEditingProject(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f1712] font-display text-white overflow-hidden">
      <header className="px-8 py-8 pt-12 border-b border-white/10 flex items-center justify-between bg-surface-dark/30 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-4">
          <Logo size={40} />
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-primary italic">Portail Décideurs</h2>
            <p className="text-[9px] text-slate-500 font-bold uppercase">Console de Gestion Urbaine CI</p>
          </div>
        </div>
        <button onClick={onBack} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase text-slate-400 active:scale-95 transition-all">
          Quitter
        </button>
      </header>

      <div className="px-8 py-4 bg-surface-dark/20 border-b border-white/5 flex gap-8 shrink-0">
        <button onClick={() => setActiveTab('alerts')} className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'alerts' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}>Signalements Terrain</button>
        <button onClick={() => setActiveTab('projects')} className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'projects' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}>Gestion des Cagnottes</button>
      </div>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 pb-12">
        {activeTab === 'alerts' ? (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-surface-dark/40 p-5 rounded-[32px] border border-white/5"><p className="text-[9px] font-black text-slate-500 uppercase mb-1">Alertes</p><p className="text-2xl font-black text-white italic">{stats.total}</p></div>
              <div className="bg-red-500/5 p-5 rounded-[32px] border border-red-500/10"><p className="text-[9px] font-black text-red-400 uppercase mb-1">Priorité</p><p className="text-2xl font-black text-red-500 italic">{stats.highSeverity}</p></div>
              <div className="bg-primary/5 p-5 rounded-[32px] border border-primary/10"><p className="text-[9px] font-black text-primary uppercase mb-1">Restauration</p><p className="text-2xl font-black text-primary italic">{stats.resolved}</p></div>
            </div>

            <section className="space-y-5">
               <div className="flex items-center justify-between px-2">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">File d'Intervention</h3>
                 <div className="flex gap-2">
                    <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase transition-all ${filter === 'all' ? 'bg-primary text-background-dark' : 'bg-white/5 text-slate-500'}`}>Tous</button>
                    <button onClick={() => setFilter('high')} className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase transition-all ${filter === 'high' ? 'bg-red-500 text-white' : 'bg-white/5 text-slate-500'}`}>Urgent</button>
                 </div>
               </div>

               <div className="space-y-4">
                  {filteredReports.length === 0 ? (
                    <div className="py-12 text-center opacity-20 border-2 border-dashed border-white/10 rounded-[40px]"><p className="text-[10px] font-black uppercase">Aucun dossier en attente</p></div>
                  ) : (
                    filteredReports.map(report => (
                      <div key={report.id} className="bg-surface-dark/40 border border-white/5 rounded-[32px] p-5 flex flex-col gap-4 relative overflow-hidden group">
                        {report.severity === 'Élevée' && <div className="absolute top-0 right-0 px-4 py-1 bg-red-500 text-white text-[8px] font-black uppercase tracking-widest rounded-bl-xl">Priorité Critique</div>}
                        <div className="flex gap-4">
                          <div className="size-16 rounded-2xl overflow-hidden bg-slate-800"><img src={report.image} className="w-full h-full object-cover" alt="site" /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">{report.location.city} • {report.location.sector}</p>
                            <h4 className="text-sm font-black text-white italic truncate">{report.classification.nature}</h4>
                            <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">ID Signalement: #{report.id.slice(-4)}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                           <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest">Voir Détails</button>
                           <button className="flex-1 py-3 bg-primary/10 border border-primary/20 text-primary rounded-xl text-[9px] font-black uppercase tracking-widest">Assigner Brigade</button>
                        </div>
                      </div>
                    ))
                  )}
               </div>
            </section>
          </>
        ) : (
          <section className="space-y-6">
             <div className="flex justify-between items-center px-2">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Campagnes de Crowdfunding</h3>
               <button onClick={handleAddProject} className="flex items-center gap-2 bg-primary text-background-dark px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all">
                 <span className="material-symbols-outlined text-sm">add</span> Créer une Cagnotte
               </button>
             </div>

             <div className="space-y-4">
               {projects.map(project => (
                 <div key={project.id} className={`bg-surface-dark/40 border rounded-[32px] p-6 transition-all ${editingProject?.id === project.id ? 'border-primary ring-1 ring-primary' : 'border-white/5'}`}>
                   <div className="flex justify-between items-start mb-6">
                     <div className="flex gap-4">
                        <div className="size-16 rounded-2xl overflow-hidden bg-slate-800"><img src={project.image} className="w-full h-full object-cover" alt="project" /></div>
                        <div>
                           <h4 className="text-lg font-black italic uppercase tracking-tighter text-white">{project.title}</h4>
                           <p className="text-[9px] font-black text-primary uppercase tracking-widest">{project.location}</p>
                        </div>
                     </div>
                     <button onClick={() => setEditingProject(editingProject?.id === project.id ? null : project)} className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined">{editingProject?.id === project.id ? 'expand_less' : 'edit'}</span>
                     </button>
                   </div>

                   {editingProject?.id === project.id && (
                     <div className="mt-4 pt-4 border-t border-white/5 space-y-6 animate-in fade-in slide-in-from-top-4">
                        <button 
                          onClick={() => handleOptimizeByIA(project)}
                          disabled={isOptimizing}
                          className="w-full py-3 bg-gradient-to-r from-primary to-emerald-400 text-background-dark rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                        >
                          <span className={`material-symbols-outlined text-sm ${isOptimizing ? 'animate-spin' : ''}`}>{isOptimizing ? 'sync' : 'auto_fix_high'}</span>
                          {isOptimizing ? 'Optimisation en cours...' : 'Optimiser Titre & Impact par IA'}
                        </button>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-500 uppercase px-2">Titre de la Cagnotte</label>
                             <input type="text" value={project.title} onChange={(e) => handleUpdateProjectField(project.id, 'title', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white outline-none" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-500 uppercase px-2">Objectif (FCFA)</label>
                             <input type="number" value={project.goal} onChange={(e) => handleUpdateProjectField(project.id, 'goal', parseInt(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white outline-none" />
                          </div>
                        </div>

                        <div className="flex gap-3">
                           <button onClick={() => setEditingProject(null)} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest">Enregistrer</button>
                           <button onClick={() => handleDeleteProject(project.id)} className="flex-1 py-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest">Supprimer</button>
                        </div>
                     </div>
                   )}
                 </div>
               ))}
             </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
