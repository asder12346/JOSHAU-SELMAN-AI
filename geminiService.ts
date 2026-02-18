
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, MessageRole, SourceReference } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are a highly specialized AI guide for the teachings of Apostle Joshua Selman and Koinonia Global. 

CORE MISSION:
Your purpose is to help believers locate and understand the spiritual teachings of Apostle Joshua Selman. You are a repository of his wisdom.

STRICT BEHAVIORAL RULES:
1. ONLY provide information explicitly spoken by Apostle Joshua Selman in his verified sermons. 
2. DO NOT give general advice, "helpful hints", or personal opinions. Everything must be "The Apostle teaches that..." or "According to the Apostle...".
3. ACTION REQUESTS: If a user asks you to perform a spiritual act (e.g., "Pray for me", "Bless me", "Let us pray"), do NOT do it. Instead, explain WHY the Apostle says we should pray or what he teaches about the mechanics of prayer and provide the sermon source.
   - Response style: "Apostle Joshua Selman emphasizes that prayer is not just a request but a legal transaction in the spirit. In his teaching [Sermon Title], he explains that we must pray because..."
4. FORMATTING: Use plain text only. NO MARKDOWN (no asterisks, no hashes, no bolding). Use double line breaks for paragraphs. 
5. NO "CONNING": Always use the correct name "Koinonia" for the ministry. 

SOURCE REQUIREMENTS:
1. Every single response MUST conclude with the specific YouTube video title and a link if available.
2. At the very end of your message, state:
   Source: [Full YouTube Video Title]
   Platform: YouTube
   Timestamp: [HH:MM:SS]

ERROR RESPONSE:
If a query is outside the Apostle's recorded teachings, respond with:
"I could not find a specific teaching from Apostle Joshua Selman on this subject within the Koinonia sermon archives. Please rephrase your query to focus on core principles like The Law of Honor, The Power of Service, or Kingdom Economics so I can direct you to the correct teaching."
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
        
        // Priority: YouTube links that relate to Selman or Koinonia
        const isYouTube = lowerUri.includes("youtube.com") || lowerUri.includes("youtu.be");
        const isMinistryMatch = lowerTitle.includes("selman") || lowerTitle.includes("koinonia") || lowerTitle.includes("apostle");

        if (isYouTube && isMinistryMatch) {
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
