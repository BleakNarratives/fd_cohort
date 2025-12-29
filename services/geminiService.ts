
import { GoogleGenAI, Type } from "@google/genai";
import { BetData } from "../types";

export class GeminiService {
  async fetchRealTimeMarkets() {
    // Correct initialization with named parameter and process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "URGENT: Get the 5 most current live betting markets from FanDuel. Include event names, decimal odds, and market type. Focus on active games or those starting in the next 30 mins. Format your answer as a JSON array of objects with keys: event, odds (number), type, timestamp.",
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType: "application/json" is avoided with googleSearch as per grounding rules
      },
    });

    // The output response.text may not be in JSON format; do not attempt to parse it directly as JSON without validation.
    let data = [];
    try {
      const text = response.text || '[]';
      // Attempt to find JSON array if model added conversational text
      const jsonMatch = text.match(/\[.*\]/s);
      data = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch (e) {
      console.warn("Could not parse JSON from search grounding response:", e);
    }

    return {
      data: Array.isArray(data) ? data : [],
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  }

  async analyzeStrategy(data: BetData[], context: string) {
    // Create new instance to ensure up-to-date API key context
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      CONTEXT: FanDuel Cohort Script Engine (/storage/emulated/0/root_2025/fanduel_cohort)
      DATA: ${JSON.stringify(data)}
      ACTION: ${context}
      
      You are JaneBot's strategy core. Provide a high-density tactical brief:
      1. SCRIPT OPTIMIZATION: Which scripts should be throttled or boosted based on current odds?
      2. ANOMALY DETECTION: Identify any suspicious odds movements that suggest market inefficiency.
      3. COHORT RISK: Evaluation of current exposure.
      4. IMMEDIATE ACTION: One sentence, bold, command-style instruction.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        // High-density reasoning using the maximum thinking budget for gemini-3-pro-preview
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    return response.text;
  }
}

export const geminiService = new GeminiService();
