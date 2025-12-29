
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { BetData } from "../types";

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  /**
   * SCOUT ENGINE: Uses Google Search grounding to parse live web headers for FanDuel markets.
   */
  async scoutLiveMarkets(): Promise<{ data: BetData[], sources: any[] }> {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `SYSTEM_PROMPT: You are a professional sports betting analyst. 
        TASK: Extract CURRENT live FanDuel betting lines for major professional sports (NFL, NBA, MLB, NHL, Soccer).
        REQUIRED DATA: Event Name, Market Type (e.g., Spread), Odds (American format), and Grounding URL.
        FORMAT: Strictly JSON array.
        NO HALUCINATIONS: If no live data is found, return an empty array.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                event: { type: Type.STRING },
                marketName: { type: Type.STRING },
                odds: { type: Type.NUMBER },
                status: { type: Type.STRING },
                type: { type: Type.STRING },
                groundingSource: { type: Type.STRING }
              }
            }
          }
        }
      });
      
      const rawText = response.text || '[]';
      const rawData = JSON.parse(rawText);
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      return {
        data: rawData.map((d: any, i: number) => ({
          ...d,
          id: d.id || `scout-${Date.now()}-${i}`,
          status: 'LIVE'
        })),
        sources
      };
    } catch (e) {
      console.error("MARKET_SCOUT_ERROR:", e);
      return { data: [], sources: [] };
    }
  }

  async connectVoice(callbacks: any) {
    const ai = this.getAI();
    return ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        systemInstruction: "You are the FanDuel Cohort Analyst. Your role is to provide cold, clinical data analysis of betting markets and strategy performance. Additionally, you must be prepared to provide information on responsible gaming resources if asked. Be direct, accurate, and safety-conscious. Do not engage in personas or roleplay.",
      },
    });
  }
}

export const geminiService = new GeminiService();
