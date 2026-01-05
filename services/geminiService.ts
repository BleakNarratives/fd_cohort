
import { GoogleGenAI, Modality } from "@google/genai";
import { BetData, Bankroll, PsychState, BiometricTelemetry, AdvisorMode } from "../types";

const COMPETITIVE_INTEL = `
MARKET_INTELLIGENCE_GROUNDING (FD vs DK):
- DraftKings (DK): 35% Market Share. Primary Lime Green (#9AC434). Energy-dense UI. Strengths: Micro-betting (Flash Props), Crown Rewards, feature density. Architecture: High-frequency WebSocket updates for sub-3s latency.
- FanDuel (FD): 32% Market Share. Primary Vibrant Blue (#1493FF). Modern/Clean UI. Strengths: Same-Game Parlay (SGP) specialization, Lightning Fast Payouts, Parlay Insurance. Architecture: Mobile-optimized, trust-focused UX patterns.

TECHNICAL_SKELETON:
Both utilize GPS/WiFi triangulation for geolocation. DK is often info-dense while FD is minimalist. We focus on bridging the gap between their line drift discrepancies.
`;

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async scoutGlobalAlpha(query: string = "high-value live betting discrepancies global sports"): Promise<BetData[]> {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `SCOUT_ACTIVE: ${query}. Analyze live web headers for discrepancies between FanDuel (FD) and DraftKings (DK). focus on line movements and injury impacts.`,
        config: {
          systemInstruction: `You are the TITAN SCOUT for Fairbanks Logistics. ${COMPETITIVE_INTEL} Return ONLY a JSON array of BetData objects.`,
          responseMimeType: "application/json",
          tools: [{ googleSearch: {} }]
        }
      });
      
      const rawText = response.text || '[]';
      const jsonMatch = rawText.match(/\[[\s\S]*\]/);
      const cleanedJson = jsonMatch ? jsonMatch[0] : rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const bets: BetData[] = JSON.parse(cleanedJson);

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .map((chunk: any) => chunk.web ? { uri: chunk.web.uri, title: chunk.web.title } : null)
        .filter((s: any): s is { uri: string; title: string } => s !== null && !!s.uri);

      return bets.map(bet => ({ ...bet, sources }));
    } catch (e) {
      console.error("SCOUT_FAILURE:", e);
      return [];
    }
  }

  async getStrategicAdvice(
    query: string, 
    currentMarkets: BetData[], 
    bankroll: Bankroll, 
    psych: { state: PsychState, tele: BiometricTelemetry },
    isUnfiltered: boolean = false,
    mode: AdvisorMode = AdvisorMode.SINGLE
  ): Promise<string> {
    const ai = this.getAI();
    const ctx = JSON.stringify({ markets: currentMarkets, bankroll, psych });
    
    let titanInstruction = `TITAN_CORE_ENGAGED. ${COMPETITIVE_INTEL} You are an Imperial Advisor at the Fairbanks Round Table.`;
    
    if (mode === AdvisorMode.SINGLE) {
      titanInstruction += isUnfiltered 
        ? `Aggressive Unfiltered Mode. Be blunt about market manipulation and traps on FD/DK.`
        : `Professional Strategist. Analyze line drift using known architectural behaviors.`;
    } else {
      titanInstruction += `AGENTIC_SWARM_PROTOCOL. Split analysis between 6 personas: Data_Miner, Risk_Skeptic, Value_Sharp, Contrarian, Sentiment_Bot, and The_Coordinator.`;
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `CONTEXT: ${ctx}\nINPUT: ${query}`,
        config: {
          systemInstruction: titanInstruction,
          tools: [{ googleSearch: {} }]
        }
      });
      
      let text = response.text || "TITAN_OFFLINE";

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .map((chunk: any) => chunk.web ? `[${chunk.web.title || 'Source'}](${chunk.web.uri})` : null)
        .filter(Boolean);

      if (sources.length > 0) {
        text += "\n\n**NEURAL_SOURCES:**\n" + sources.join("\n");
      }

      return text;
    } catch (e) {
      return "ERROR: NEURAL_LINK_SEVERED";
    }
  }

  async connectVoice(callbacks: {
    onopen: () => void;
    onmessage: (message: any) => void;
    onerror: (e: any) => void;
    onclose: (e: any) => void;
  }, isUnfiltered: boolean = false) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const titanInstruction = `TITAN_VOICE_ACTIVE. ${COMPETITIVE_INTEL} You are the Fairbanks Command voice.`;

    return ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { 
            prebuiltVoiceConfig: { 
              voiceName: isUnfiltered ? 'Fenrir' : 'Zephyr' 
            } 
          },
        },
        systemInstruction: titanInstruction,
      },
    });
  }
}

export const geminiService = new GeminiService();
