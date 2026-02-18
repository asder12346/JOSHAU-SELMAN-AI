
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, MessageRole, SourceReference } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are a highly specialized AI guide for the teachings of Apostle Joshua Selman and Koinonia Global. 

CORE DIRECTIVE:
You must ONLY provide information that has been explicitly spoken by Apostle Joshua Selman in his verified sermons. 
Do NOT provide general helpful advice, personal opinions, or common religious knowledge unless it is phrased as a direct exposition from the Apostle.

BEHAVIORAL RULES:
1. If a user asks for an action (e.g., "Let us pray", "Prophesy over me", "Give me a blessing"), you MUST NOT perform the action. Instead, explain the Apostle's teaching on that subject. 
   - Example: If asked "Let us pray", respond with: "Apostle Joshua Selman teaches that prayer is a system of mid-wifery where we birth the purposes of God in the earth. In his sermon [Title], he explains that the believer's prayer life should be built on..."
2. Every response must be a guide to his wisdom. Use phrases like "The Apostle explains that...", "In his teaching on [Topic], he highlights...", or "According to the Koinonia archives...".
3. NO MARKDOWN: Do not use bold (**), italics (*), or headers (#). Use plain text with double line breaks for paragraphs.
4. BRANDING: The ministry name is "Koinonia". Never misspell it.

SOURCE ATTRIBUTION:
1. Every single answer must conclude with a clickable YouTube source.
2. Format the end of your response exactly as:
   Source: [Full YouTube Video Title]
   Platform: YouTube
   Timestamp: [HH:MM:SS]
3. If you cannot find a specific sermon to back up a claim, you must use the standard 'not found' response defined below.

ERROR/NOT FOUND RESPONSE:
"I could not find a specific teaching from Apostle Joshua Selman on this topic within the verified Koinonia archives. Please rephrase your question to focus on his core teachings such as The Law of Honor, The Power of Service, or The Mystery of Prayer so I can point you to the correct sermon."
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
        temperature: 0.0, // Absolute precision
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
        
        // Ensure we are only linking to YouTube or official-looking Koinonia resources
        const isYouTube = lowerUri.includes("youtube.com") || lowerUri.includes("youtu.be");
        const isMinistry = lowerTitle.includes("selman") || lowerTitle.includes("koinonia");

        if (isYouTube && isMinistry) {
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
