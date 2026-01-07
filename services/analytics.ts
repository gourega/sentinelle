
/**
 * Service d'Analytics pour Sentinelle Verte CI
 * Permet de mesurer l'impact citoyen de manière anonyme.
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const trackEvent = (eventName: string, params: object = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...params,
      platform: 'web_pwa',
      app_version: '1.1.0'
    });
  }
};

export const Analytics = {
  // Tracking des flux de signalement
  logCameraOpen: () => trackEvent('camera_open'),
  logAnalysisStart: (isUpdate: boolean) => trackEvent('analysis_start', { mode: isUpdate ? 'update' : 'new' }),
  logReportCreated: (commune: string, nature: string) => trackEvent('report_created', { commune, nature }),
  
  // Tracking de l'IA
  logAssistantQuery: (queryLength: number) => trackEvent('assistant_query', { length: queryLength }),
  logAudioPlayed: () => trackEvent('audio_analysis_played'),
  
  // Gamification
  logBadgeUnlocked: (badgeTitle: string) => trackEvent('badge_unlocked', { badge: badgeTitle }),
  
  // Navigation
  logScreenView: (screenName: string) => trackEvent('screen_view', { screen: screenName })
};
