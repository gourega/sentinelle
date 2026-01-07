
import { WasteReport, UserProfile } from '../types';

const STORAGE_REPORTS_KEY = 'sv_cloud_reports_mock';
const STORAGE_PROFILE_KEY = 'sv_cloud_profile_mock';

/**
 * Simule une synchronisation avec un backend (Supabase plus tard).
 * Utilise actuellement le LocalStorage pour permettre le développement hors-ligne.
 */

export const syncProfileToCloud = async (uid: string, profile: UserProfile) => {
  // Simule un délai réseau
  await new Promise(resolve => setTimeout(resolve, 500));
  const data = JSON.parse(localStorage.getItem(STORAGE_PROFILE_KEY) || '{}');
  data[uid] = { ...profile, lastSync: Date.now() };
  localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(data));
};

export const syncReportToCloud = async (uid: string, report: WasteReport) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const reports = JSON.parse(localStorage.getItem(STORAGE_REPORTS_KEY) || '[]');
  const index = reports.findIndex((r: any) => r.id === report.id);
  
  const reportWithMeta = { ...report, userId: uid, syncedAt: Date.now() };
  
  if (index >= 0) {
    reports[index] = reportWithMeta;
  } else {
    reports.push(reportWithMeta);
  }
  
  localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(reports));
};

export const getUserReports = async (uid: string): Promise<WasteReport[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const reports = JSON.parse(localStorage.getItem(STORAGE_REPORTS_KEY) || '[]');
  return reports
    .filter((r: any) => r.userId === uid)
    .sort((a: any, b: any) => b.timestamp - a.timestamp);
};

export const getCommunityReports = async (): Promise<WasteReport[]> => {
  const reports = JSON.parse(localStorage.getItem(STORAGE_REPORTS_KEY) || '[]');
  return reports.slice(0, 10); // Retourne les derniers signalements publics simulés
};
