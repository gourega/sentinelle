import { GoogleGenAI, Modality, Type } from "@google/genai";
import { AIAnalysisResult, ChatMessage, WasteReport, EvolutionEntry, WasteStatus } from "../types";

/**
 * Analyse une image de déchets. 
 * On utilise gemini-3-pro-preview car c'est une tâche complexe de raisonnement et de classification.
 */
export const analyzeWasteImage = async (base64Image: string): Promise<AIAnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
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
            text: `Tu es un expert environnemental chevronné en Côte d'Ivoire. Analyse cette image de pollution. 
            Fournis un JSON incluant : 
            - nature (WasteNature : Ménagers, Volumineux, Construction, Verts ou Spéciaux)
            - status (WasteStatus)
            - confidence (number entre 0 et 1)
            - description (string détaillée)
            - severity ('Faible'|'Moyenne'|'Élevée')
            - insight (conseil expert string)
            - city (ville de Côte d'Ivoire identifiée ou supposée)
            - sector (commune ou quartier)
            - actionPlan (tableau de 3 étapes de résolution)
            - classification (tableau d'objets {label, percentage})
            Réponds EXCLUSIVEMENT en JSON.`
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 0 }
    }
  });

  const content = response.text;
  if (!content) throw new Error("L'IA n'a pas pu traiter l'image.");
  return JSON.parse(content) as AIAnalysisResult;
};

/**
 * Génère une vision "propre" (CleanVision).
 */
export const generateCleanVision = async (base64Image: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
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
            text: "Transforme ce site pollué en Côte d'Ivoire en un espace urbain idéal, propre, avec de la verdure et sans aucun déchet. Garde la structure des bâtiments.",
          },
        ],
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    return imagePart ? `data:image/png;base64,${imagePart.inlineData.data}` : null;
  } catch (e) {
    console.error("Erreur CleanVision:", e);
    return null;
  }
};

/**
 * Chat interactif avec Grounding Google Search.
 */
export const sustainabilityChat = async (history: ChatMessage[], message: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "Tu es l'Assistant Officiel Sentinelle Verte. Ton rôle est d'aider les citoyens ivoiriens à gérer leurs déchets. Utilise Google Search pour trouver les centres de recyclage réels ou les lois environnementales en vigueur en Côte d'Ivoire.",
      tools: [{ googleSearch: {} }]
    }
  });
  
  return await chat.sendMessage({ message });
};

/**
 * Synthèse vocale de l'analyse.
 */
export const generateAnalysisAudio = async (text: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
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
    return null;
  }
};

export const findNearestRecyclingCenter = async (nature: string, city: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Identifie un point de collecte officiel ou un centre de recyclage pour des déchets de type "${nature}" à "${city}", Côte d'Ivoire. Réponds en JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          url: { type: Type.STRING }
        },
        required: ["name", "url"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const analyzeEvolution = async (beforeImage: string, afterImage: string): Promise<{ status: WasteStatus; insight: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: beforeImage.split(',')[1] || beforeImage, mimeType: "image/jpeg" } },
        { inlineData: { data: afterImage.split(',')[1] || afterImage, mimeType: "image/jpeg" } },
        { text: "Compare ces deux photos d'un site en Côte d'Ivoire. L'état s'est-il amélioré ? Donne le nouveau statut et une analyse courte en JSON." }
      ]
    },
    config: {
      responseMimeType: "application/json"
    }
  });
  return JSON.parse(response.text || "{}");
};

export const optimizeCampaignDescription = async (title: string, location: string, needs: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Optimise ce projet citoyen à ${location} : "${title}". Besoins : ${needs.join(', ')}. Réponds en JSON avec un titre impactant et une description motivante.`,
    config: {
      responseMimeType: "application/json"
    }
  });
  return JSON.parse(response.text || "{}");
};

export const formatOfficialReport = (report: WasteReport): string => {
  return `RAPPORT OFFICIEL - SENTINELLE VERTE CI\nID: ${report.id}\nLieu: ${report.location.city}, ${report.location.sector}\nNature: ${report.classification.nature}\nStatut: ${report.classification.status}\n\nExpertise IA: ${report.insight}`;
};
