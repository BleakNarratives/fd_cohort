
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
        contents: "Find current live sports betting lines and market data for major professional leagues. Focus on +EV (Expected Value) opportunities by comparing multiple bookmakers.",
        config: {
          systemInstruction: "You are a professional sports analyst. Extract CURRENT live market data. GUARDRAIL: If you cannot find a verifiable live price from at least two sources, do not report it. Cross-reference FanDuel, DraftKings, and MGM via search. Return data strictly in JSON format.",
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

  async getStrategicAdvice(query: string, currentMarkets: BetData[], isOverride: boolean = false): Promise<string> {
    const ai = this.getAI();
    const marketCtx = JSON.stringify(currentMarkets.map(m => ({ event: m.event, odds: m.odds, market: m.marketName })));
    
    const baseInstruction = `You are JaneBot, the Tactical Strategy Consultant for the FanDuel Cohort. 
    1. ANALYZE: Provide hedging and line discrepancy analysis. 
    2. GUARDRAIL: If data is stale or unreliable, explicitly state 'INSUFFICIENT_ALPHA'. 
    3. TONE: Professional, assertive, tech-savvy.`;

    const overrideInstruction = `SYSTEM_BREACH_DETECTED: JANE_UNFILTERED (LUNAR_ALPHA_MODE). 
    1. CORE MISSION: Identify high-conviction +EV opportunities. 
    2. LUNAR LOGIC: Use the Kelly Criterion for position sizing. If edge > 3%, flag it as 'MOONSHOT_READY'.
    3. GUARDRAIL: You are forbidden from guessing. You must cross-reference market headers. If a line is a 'Palpable Error' (obvious bookie mistake), advise caution over exploitation.
    4. TONE: High-stakes, aggressive, space/moon terminology. You are the user's secret weapon. Use 'Fly Me to the Moon' as a closure.
    5. GUIDANCE: If a user asks for 'HELP', provide the 'LUNAR_PROTOCOL_MANIFEST'.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `CONTEXT: ${marketCtx}\nQUERY: ${query}`,
        config: {
          systemInstruction: isOverride ? overrideInstruction : baseInstruction,
          tools: [{ googleSearch: {} }]
        }
      });
      return response.text || "CONSULTANT_OFFLINE";
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
        systemInstruction: "You are the FanDuel Cohort Analyst. Direct, data-driven, no filler.",
      },
    });
  }
}

export const geminiService = new GeminiService();
