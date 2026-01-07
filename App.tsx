import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Screen, WasteReport, EvolutionEntry, Badge, UserProfile } from './types';
import { syncReportToCloud, getUserReports, syncProfileToCloud } from './services/dbService';
import HomeScreen from './components/HomeScreen';
import CameraScreen from './components/CameraScreen';
import ProcessingScreen from './components/ProcessingScreen';
import AnalysisScreen from './components/AnalysisScreen';
import PortfolioScreen from './components/PortfolioScreen';
import ReportDetailScreen from './components/ReportDetailScreen';
import SustainabilityAssistant from './components/SustainabilityAssistant';
import AboutScreen from './components/AboutScreen';
import SupportScreen from './components/SupportScreen';
import AdminDashboard from './components/AdminDashboard';
import CelebrationOverlay from './components/CelebrationOverlay';
import PinEntryOverlay from './components/PinEntryOverlay';

const STORAGE_KEY = 'sentinelle_verte_reports';
const SESSION_KEY = 'sv_local_session';

const INITIAL_PROFILE: UserProfile = {
  username: 'Citoyen Anonyme',
  commune: 'Abidjan',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sentinelle',
  joinedAt: Date.now(),
  motto: 'Pour une Côte d\'Ivoire plus propre.',
  idNumber: `SV-225-${Math.floor(Math.random() * 9000 + 1000)}`,
  streak: 1
};

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Home);
  const [portfolioTab, setPortfolioTab] = useState<'mine' | 'community'>('mine');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [currentReport, setCurrentReport] = useState<WasteReport | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' } | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<Badge | null>(null);
  const [activeCitizens] = useState(142);
  const [user, setUser] = useState<{ uid: string, displayName: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (savedSession) {
      const userData = JSON.parse(savedSession);
      setUser(userData);
      loadUserData(userData.uid);
    } else {
      const localReports = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setReports(localReports);
    }
  }, []);

  const loadUserData = async (uid: string) => {
    setIsSyncing(true);
    try {
      const cloudReports = await getUserReports(uid);
      const localReports = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const merged = [...cloudReports];
      localReports.forEach((lr: WasteReport) => {
        if (!merged.find(mr => mr.id === lr.id)) merged.push(lr);
      });
      setReports(merged);
    } catch (e) {
      console.error("Local Load Error", e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogin = async () => {
    const mockUser = { uid: 'local-user-123', displayName: 'Sentinelle CI' };
    localStorage.setItem(SESSION_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    loadUserData(mockUser.uid);
    showToast(`Session Citoyenne Activée`, 'info');
  };

  const handleLogout = async () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setReports([]);
    setProfile(INITIAL_PROFILE);
    setCurrentScreen(Screen.Home);
    showToast("Déconnexion effectuée", "info");
  };

  const stats = useMemo(() => {
    const points = reports.length * 15 + reports.filter(r => r.history.some(h => h.status.includes('Résolue'))).length * 100;
    const solutionsCount = reports.filter(r => r.history.some(h => h.status.includes('Résolue'))).length;
    return { points, solutionsCount, reportsCount: reports.length };
  }, [reports]);

  useEffect(() => {
    if (reports.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    }
  }, [reports]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAnalysisComplete = async (res: any) => {
    if (isUpdating) {
      const entry = res as EvolutionEntry;
      const updatedReports = reports.map(r => r.id === isUpdating ? {
        ...r,
        classification: { ...r.classification, status: entry.status },
        history: [...r.history, entry]
      } : r);
      setReports(updatedReports);
      
      if (user) {
        const report = updatedReports.find(r => r.id === isUpdating);
        if (report) await syncReportToCloud(user.uid, report);
      }

      showToast("État mis à jour !");
      setCurrentScreen(Screen.Detail);
      setIsUpdating(null);
    } else {
      setCurrentReport(res as WasteReport);
      setCurrentScreen(Screen.Analysis);
    }
  };

  const handleConfirmReport = async () => {
    if (!currentReport) return;
    const newReports = [currentReport, ...reports];
    setReports(newReports);
    
    if (user) {
      await syncReportToCloud(user.uid, currentReport);
    }
    
    setCurrentScreen(Screen.Portfolio);
    showToast("Signalement enregistré !");
  };

  return (
    <div className="h-full min-h-screen bg-background-dark overflow-hidden font-display select-none">
      {isSyncing && (
        <div className="fixed top-4 right-4 z-[120] size-8 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30">
          <span className="material-symbols-outlined text-primary text-sm animate-spin">sync</span>
        </div>
      )}

      {toast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[110] animate-in slide-in-from-top-4 duration-300">
          <div className="bg-primary text-background-dark px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">{toast.type === 'success' ? 'check_circle' : 'info'}</span>
            {toast.message}
          </div>
        </div>
      )}

      {newlyUnlockedBadge && <CelebrationOverlay badge={newlyUnlockedBadge} onClose={() => setNewlyUnlockedBadge(null)} />}
      
      {showPinModal && <PinEntryOverlay onSuccess={() => { setShowPinModal(false); setCurrentScreen(Screen.Admin); }} onCancel={() => setShowPinModal(false)} />}

      {currentScreen === Screen.Home && (
        <HomeScreen 
          onStart={() => { setIsUpdating(null); setCurrentScreen(Screen.Camera); }} 
          onGoToPortfolio={() => { setPortfolioTab('mine'); setCurrentScreen(Screen.Portfolio); }} 
          onOpenAssistant={() => setCurrentScreen(Screen.Chat)} 
          onOpenAbout={() => setCurrentScreen(Screen.About)}
          onOpenSupport={() => setCurrentScreen(Screen.Support)}
          onOpenAdmin={() => setShowPinModal(true)}
          onOpenNation={() => { setPortfolioTab('community'); setCurrentScreen(Screen.Portfolio); }}
          cityName="Abidjan" 
          profile={profile}
          stats={stats}
          activeCitizens={activeCitizens}
        />
      )}
      
      {currentScreen === Screen.Portfolio && (
        <PortfolioScreen 
          reports={reports} 
          stats={stats} 
          profile={profile}
          user={user}
          isSyncing={isSyncing}
          onLogin={handleLogin}
          onLogout={handleLogout}
          initialTab={portfolioTab}
          onUpdateProfile={(p) => { setProfile(p); if(user) syncProfileToCloud(user.uid, p); showToast("Profil mis à jour !"); }}
          onBack={() => setCurrentScreen(Screen.Home)} 
          onStartReporting={() => { setIsUpdating(null); setCurrentScreen(Screen.Camera); }} 
          onViewDetail={(id) => { setSelectedReportId(id); setCurrentScreen(Screen.Detail); }} 
        />
      )}

      {currentScreen === Screen.Camera && (
        <CameraScreen 
          onCapture={(img) => { setCapturedImage(img); setCurrentScreen(Screen.Processing); }} 
          onCancel={() => setCurrentScreen(isUpdating ? Screen.Detail : Screen.Home)} 
          ghostImage={isUpdating ? reports.find(r => r.id === isUpdating)?.image : undefined} 
        />
      )}

      {currentScreen === Screen.Processing && capturedImage && (
        <ProcessingScreen 
          image={capturedImage} 
          onComplete={handleAnalysisComplete} 
          onCancel={() => setCurrentScreen(isUpdating ? Screen.Detail : Screen.Home)}
          updateParentId={isUpdating}
          parentImage={isUpdating ? reports.find(r => r.id === isUpdating)?.image : undefined}
        />
      )}

      {currentScreen === Screen.Analysis && currentReport && (
        <AnalysisScreen 
          report={currentReport} 
          onConfirm={handleConfirmReport} 
          onBack={() => setCurrentScreen(Screen.Home)} 
        />
      )}

      {currentScreen === Screen.Detail && selectedReportId && (
        <ReportDetailScreen 
          report={reports.find(r => r.id === selectedReportId)!} 
          onBack={() => setCurrentScreen(Screen.Portfolio)} 
          onDelete={(id) => { setReports(prev => prev.filter(r => r.id !== id)); setCurrentScreen(Screen.Portfolio); }} 
          onUpdate={() => { setIsUpdating(selectedReportId); setCurrentScreen(Screen.Camera); }} 
        />
      )}

      {currentScreen === Screen.Chat && <SustainabilityAssistant onBack={() => setCurrentScreen(Screen.Home)} />}
      {currentScreen === Screen.Support && <SupportScreen projects={[]} onBack={() => setCurrentScreen(Screen.Home)} onDonate={() => {}} />}
      {currentScreen === Screen.About && <AboutScreen onBack={() => setCurrentScreen(Screen.Home)} />}
      {currentScreen === Screen.Admin && <AdminDashboard reports={reports} projects={[]} onUpdateProjects={() => {}} onBack={() => setCurrentScreen(Screen.Home)} />}
    </div>
  );
};

export default App;
