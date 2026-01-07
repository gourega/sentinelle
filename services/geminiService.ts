import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AIAnalysisResult, ChatMessage, WasteReport, EvolutionEntry } from "../types";

// Always use process.env.API_KEY for the API key as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const optimizeCampaignDescription = async (title: string, location: string, needs: string[]): Promise<{ optimizedTitle: string, description: string }> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Tu es un expert en communication humanitaire et environnementale en Côte d'Ivoire. 
    À partir de ces éléments, génère un titre accrocheur et une description émouvante et mobilisatrice pour une campagne de crowdfunding citoyen.
    Titre initial: ${title}
    Localisation: ${location}
    Besoins: ${needs.join(', ')}
    Réponds en JSON avec : optimizedTitle, description.`,
    config: {
      responseMimeType: "application/json",
    }
  });
  return JSON.parse(response.text || "{}");
};

export const analyzeEvolution = async (oldImage: string, newImage: string): Promise<{ status: any, insight: string }> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: oldImage.split(',')[1] || oldImage } },
          { inlineData: { mimeType: "image/jpeg", data: newImage.split(',')[1] || newImage } },
          {
            text: `Compare ces deux images du même endroit en Côte d'Ivoire. La première est l'état initial, la seconde est l'état actuel.
            Détermine si la situation s'est améliorée (Zone Nettoyée), est stable ou a empiré.
            Réponds en JSON avec : status (WasteStatus), insight (Brève analyse de l'évolution en français).`
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
    }
  });

  return JSON.parse(response.text || "{}");
};

export const getCityFromCoords = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Tu es un expert en géographie de la Côte d'Ivoire. Identifie la ville ou la commune située aux coordonnées GPS : latitude ${lat}, longitude ${lng}. Réponds UNIQUEMENT le nom de la ville ou de la commune.`,
    });
    return response.text.trim().replace(/[.]/g, '') || "Côte d'Ivoire";
  } catch (e) {
    return "Abidjan";
  }
};

export const analyzeWasteImage = async (base64Image: string): Promise<AIAnalysisResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(',')[1] || base64Image
            }
          },
          {
            text: `Tu es un expert environnemental en Côte d'Ivoire. Analyse cette image de déchets. 
            Fournis un JSON incluant : Nature, Statut, Confiance, Description, Sévérité, Insight, Ville, Secteur. 
            Ajoute un "actionPlan" (tableau de 3 étapes concrètes pour résoudre ce dépôt). 
            Réponds EXCLUSIVEMENT en JSON.`
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
    }
  });

  return JSON.parse(response.text || "{}") as AIAnalysisResult;
};

export const generateCleanVision = async (base64Image: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1] || base64Image,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: 'Generate a high-quality, clean, and green version of this same urban spot in Côte d\'Ivoire. Replace the waste with a clean sidewalk, green grass, and small flowers.',
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (e) {
    return null;
  }
};

export const findNearestRecyclingCenter = async (wasteType: string, location: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Donne-moi le centre de collecte ou de recyclage le plus proche pour "${wasteType}" à "${location}", Côte d'Ivoire.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    return { 
      name: (chunks as any)?.[0]?.web?.title || "Centre National ANAGED", 
      url: (chunks as any)?.[0]?.web?.uri || "https://www.anaged.ci/" 
    };
  } catch (e) {
    return { name: "ANAGED (Portail National)", url: "https://www.anaged.ci/" };
  }
};

export const sustainabilityChat = async (history: ChatMessage[], message: string) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "Tu es Sentinelle-Assistant CI. Ton rôle est d'aider les citoyens ivoiriens à mieux gérer leurs déchets.",
      tools: [{ googleSearch: {} }]
    }
  });
  
  const response = await chat.sendMessage({ message });
  return response;
};

// Fixed error: Module '"../services/geminiService"' has no exported member 'generateAnalysisAudio'.
/**
 * Generates an audio commentary of the waste analysis using Gemini's text-to-speech capabilities.
 */
export const generateAnalysisAudio = async (text: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (e) {
    console.error("Audio generation error:", e);
    return null;
  }
};

// Fixed error: Module '"../services/geminiService"' has no exported member 'formatOfficialReport'.
/**
 * Formats a waste report into a professional text document for sharing or official records.
 */
export const formatOfficialReport = (report: WasteReport): string => {
  return `
RAPPORT OFFICIEL - SENTINELLE VERTE CI
--------------------------------------
ID DU DOSSIER : ${report.id}
DATE : ${new Date(report.timestamp).toLocaleDateString('fr-FR')}
LOCALISATION : ${report.location.city}, ${report.location.sector}
NATURE DES DÉCHETS : ${report.classification.nature}
STATUT ACTUEL : ${report.classification.status}
SÉVÉRITÉ : ${report.severity}

ANALYSE DE L'EXPERT :
${report.insight}

PLAN D'ACTION :
${report.actionPlan?.map((step, i) => `${i + 1}. ${step}`).join('\n')}

Vérifié par Intelligence Artificielle Sentinelle Verte CI.
  `.trim();
};
