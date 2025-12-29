
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { BetData, EngineMode } from "../types";

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private getLocalMockData(): BetData[] {
    const sports = ['NFL', 'NBA', 'MLB', 'NHL', 'UFC'];
    const markets = ['Moneyline', 'Spread', 'Total O/U', 'Player Prop'];
    return Array.from({ length: 4 }).map((_, i) => ({
      id: `local-${Date.now()}-${i}`,
      timestamp: new Date().toISOString(),
      event: `${sports[Math.floor(Math.random() * sports.length)]}: Local Simulation ${i + 1}`,
      odds: Math.random() > 0.5 ? Math.floor(Math.random() * 200) + 100 : Math.floor(Math.random() * -200) - 100,
      marketName: markets[Math.floor(Math.random() * markets.length)],
      status: 'LIVE',
      type: 'COHORT_SCRIPT_GEN',
      groundingSource: 'file:///storage/emulated/0/root_2025/fanduel_cohort/'
    }));
  }

  async scoutLiveMarkets(mode: EngineMode = EngineMode.LIVE): Promise<{ data: BetData[], sources: any[], error?: string }> {
    if (mode === EngineMode.LOCAL) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ data: this.getLocalMockData(), sources: [] }), 800);
      });
    }

    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: "Find current live sports betting lines and market data for major professional leagues.",
        config: {
          systemInstruction: "You are a professional sports analyst. Extract CURRENT live market data and return it strictly in JSON format. Do not include markdown formatting or explanations.",
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
      let rawData = JSON.parse(rawText.replace(/```json|```/gi, '').trim());
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      return {
        data: Array.isArray(rawData) ? rawData.map((d: any, i: number) => ({
          ...d,
          id: d.id || `scout-${Date.now()}-${i}`,
          status: 'LIVE'
        })) : [],
        sources
      };
    } catch (e: any) {
      return { data: [], sources: [], error: "CONNECTION_FAILURE" };
    }
  }

  /**
   * TACTICAL CONSULTANT: Provides strategic advice based on current market state.
   */
  async getStrategicAdvice(query: string, currentMarkets: BetData[]): Promise<string> {
    const ai = this.getAI();
    const marketCtx = JSON.stringify(currentMarkets.map(m => ({ event: m.event, odds: m.odds, market: m.marketName })));
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `USER_QUERY: ${query}\n\nCURRENT_MARKET_CONTEXT: ${marketCtx}`,
        config: {
          systemInstruction: "You are JaneBot, the Tactical Strategy Consultant for the FanDuel Cohort. Your goal is to provide high-level educational analysis on betting markets. Look for hedging opportunities, line discrepancies, and risk mitigation strategies. Be assertive, professional, and slightly edgy. Use 'Dopamine Factory' terminology.",
          tools: [{ googleSearch: {} }]
        }
      });
      return response.text || "CONSULTANT_OFFLINE: UNABLE_TO_PARSE_STRATEGY";
    } catch (e) {
      return "ERROR: QUANTUM_LINK_SEVERED";
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
        systemInstruction: "You are the FanDuel Cohort Analyst. Focus on objective data points.",
      },
    });
  }
}

export const geminiService = new GeminiService();
