
export enum Screen {
  Home = 'HOME',
  Camera = 'CAMERA',
  Processing = 'PROCESSING',
  Analysis = 'ANALYSIS',
  Portfolio = 'PORTFOLIO',
  Detail = 'DETAIL',
  Chat = 'CHAT',
  About = 'ABOUT',
  Support = 'SUPPORT',
  Admin = 'ADMIN'
}

export interface UserProfile {
  username: string;
  commune: string;
  avatar: string;
  joinedAt: number;
  motto: string;
  idNumber: string;
  streak: number;
}

export type WasteNature = 
  | 'Déchets Ménagers Ordinaires'
  | 'Volumineux / Encombrants'
  | 'Construction et Gravats'
  | 'Déchets Verts'
  | 'Déchets Spéciaux / Dangereux';

export type WasteStatus = 
  | 'Dépôt Initial / Nouveau'
  | 'Dépôt Critique / Volumineux'
  | 'Zone de Nettoyage en Cours'
  | 'Zone Nettoyée / Résolue'
  | 'Réapparition / Récidive';

export interface ClassificationItem {
  label: string;
  percentage: number;
}

export interface EvolutionEntry {
  timestamp: number;
  image: string;
  status: WasteStatus;
  insight: string;
}

export interface WasteReport {
  id: string;
  timestamp: number;
  image: string;
  cleanVisionImage?: string; 
  actionPlan?: string[];     
  history: EvolutionEntry[];
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    sector: string;
  };
  classification: {
    nature: WasteNature;
    status: WasteStatus;
    confidence: number;
    description: string;
    items: ClassificationItem[];
  };
  severity: 'Faible' | 'Moyenne' | 'Élevée';
  insight: string;
  nearestCenter?: {
    name: string;
    url: string;
  };
}

export interface AIAnalysisResult {
  nature: WasteNature;
  status: WasteStatus;
  confidence: number;
  description: string;
  severity: 'Faible' | 'Moyenne' | 'Élevée';
  insight: string;
  actionPlan: string[];
  classification: ClassificationItem[];
  city: string;
  sector: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  threshold: number;
  category: 'reports' | 'solutions' | 'points';
}

export const OFFICIAL_BADGES: Badge[] = [
  { id: '1', title: 'Vigilant', description: 'Premier signalement effectué', icon: 'visibility', threshold: 1, category: 'reports' },
  { id: '2', title: 'Nettoyeur', description: 'Une zone résolue avec succès', icon: 'cleaning_services', threshold: 1, category: 'solutions' },
  { id: '3', title: 'Patriote', description: '5 signalements d\'intérêt public', icon: 'flag', threshold: 5, category: 'reports' },
  { id: '4', title: 'Expert', description: 'Atteindre 500 points d\'impact', icon: 'military_tech', threshold: 500, category: 'points' },
];

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface CitizenProject {
  id: string;
  title: string;
  location: string;
  goal: number;
  current: number;
  image: string;
  needs: string[];
}
