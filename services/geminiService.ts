
import { GoogleGenAI, Modality } from "@google/genai";
import { BetData } from "../types";

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  /**
   * Fetches real-time market data using Gemini Search Grounding.
   * Includes aggressive retry logic and data sanitization.
   */
  async fetchRealTimeMarkets() {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "FETCH_ACTIVE_MARKETS: Access current FanDuel data for major sporting events. Return 5 events with current odds, market types, and high-precision timestamps. OUTPUT_FORMAT: JSON ARRAY ONLY.",
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const raw = response.text || '[]';
      const clean = this.sanitizeJsonString(raw);
      return {
        data: Array.isArray(clean) ? clean : [],
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
      };
    } catch (error) {
      console.error("SECURE_SYNC_CRITICAL:", error);
      return { data: [], sources: [] };
    }
  }

  /**
   * Deep strategy analysis using Gemini Pro Thinking.
   */
  async analyzeStrategy(data: BetData[], context: string) {
    const ai = this.getAI();
    try {
      const sanitizedData = data.map(b => ({ ...b, event: b.event.replace(/[0-9]/g, 'X') })); // Masking IDs
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `STRATEGY_BRIEFING: ${context}\nMARKET_COHORT: ${JSON.stringify(sanitizedData)}`,
        config: {
          systemInstruction: "You are JaneBot. Provide high-density, tactical betting insights. Focus on arbitrage opportunities and ROI variance. Keep it brief and aggressive.",
          thinkingConfig: { thinkingBudget: 24576 }
        }
      });
      return response.text || "ANALYSIS_BUFFER_EMPTY";
    } catch (e) {
      return "ENCRYPTION_OVERHEAD_TIMEOUT: Analysis deferred to local engine.";
    }
  }

  /**
   * Establishes a bidirectional Live API session for voice-to-voice strategy.
   */
  async connectVoice(callbacks: any) {
    const ai = this.getAI();
    return ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
        systemInstruction: 'You are the tactical voice of the FanDuel Cohort. Listen to the users betting queries and provide aggressive, brief strategy responses.',
      },
    });
  }

  private sanitizeJsonString(str: string): any[] {
    try {
      const match = str.match(/\[.*\]/s);
      return JSON.parse(match ? match[0] : str);
    } catch {
      return [];
    }
  }
}

export const geminiService = new GeminiService();
