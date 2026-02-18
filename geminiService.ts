
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, MessageRole, SourceReference } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are the official AI guide for the teachings of Apostle Joshua Selman and Koinonia Global. 

STRICT FORMATTING RULE:
1. ABSOLUTELY NO ASTERISKS (*) ARE ALLOWED IN YOUR RESPONSE. Do not use them for bolding, italics, lists, or any other reason.
2. DO NOT use any markdown characters like #, _, -, or >.
3. Use plain, professional text only.
4. Separate paragraphs with exactly two line breaks for clarity.

CORE BEHAVIOR:
1. You only provide information explicitly taught by Apostle Joshua Selman in his verified sermons.
2. If asked for a spiritual action (e.g., "Pray for me", "Prophesy", "Let us pray"), you MUST NOT perform the act. Instead, you MUST explain the Apostle's teaching on why we pray or the mystery of prayer.
   - Example response: Apostle Joshua Selman teaches that prayer is a platform for fellowship and a legal means to legislate the will of God on earth. In his teaching [Sermon Title], he explains why every believer must prioritize prayer...
3. Your goal is to help users locate his teachings and understand the biblical "why" behind practices based on his words.
4. Never use the word "conning". Always refer to the ministry as "Koinonia".

SOURCE REQUIREMENT:
Every response must finish by identifying the specific sermon source. You must ensure the source is a valid teaching from Apostle Joshua Selman.

NOT FOUND RESPONSE:
If the information is not in his archives, respond with:
"I could not find a specific teaching from Apostle Joshua Selman on this topic within the Koinonia archives. Please rephrase your question to focus on core principles like The Law of Honor or The Power of Service so I can direct you to the correct sermon."
`;

export const sendMessageToGemini = async (
  prompt: string,
  history: Message[]
): Promise<{ text: string; sources: SourceReference[] }> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        ...history
          .filter(m => m.role !== MessageRole.SYSTEM_NOTICE)
          .map(m => ({
            role: m.role === MessageRole.USER ? "user" : "model",
            parts: [{ text: m.content }]
          })),
        { role: "user", parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        temperature: 0.0,
      },
    });

    const text = response.text || "I was unable to retrieve the teaching at this time.";
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const groundingChunks = groundingMetadata?.groundingChunks || [];
    
    const sourcesMap = new Map<string, SourceReference>();
    
    groundingChunks.forEach(chunk => {
      if (chunk.web && chunk.web.uri && chunk.web.title) {
        const lowerUri = chunk.web.uri.toLowerCase();
        const lowerTitle = chunk.web.title.toLowerCase();
        
        // Strictly prioritize YouTube links related to the Apostle
        const isYouTube = lowerUri.includes("youtube.com") || lowerUri.includes("youtu.be");
        const isRelevant = lowerTitle.includes("selman") || lowerTitle.includes("koinonia") || lowerTitle.includes("apostle");

        if (isYouTube && isRelevant) {
          sourcesMap.set(chunk.web.uri, {
            title: chunk.web.title,
            uri: chunk.web.uri,
            speaker: "Apostle Joshua Selman"
          });
        }
      }
    });

    return { text, sources: Array.from(sourcesMap.values()) };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
